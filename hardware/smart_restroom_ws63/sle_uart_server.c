/**
# Copyright (C) 2024 HiHope Open Source Organization .
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
 */

#include "securec.h"
#include "sle_common.h"
#include "osal_debug.h"
#include "sle_errcode.h"
#include "osal_addr.h"
#include "osal_task.h"
#include "sle_connection_manager.h"
#include "sle_device_discovery.h"
#include "sle_uart_server_adv.h"
#include "sle_uart_server.h"
#include "cmsis_os2.h"
#include "ohos_init.h"
#include "ohos_sle_common.h"
#include "ohos_sle_errcode.h"
#include "ohos_sle_ssap_server.h"
#include "ohos_sle_ssap_client.h"
#include "ohos_sle_device_discovery.h"
#include "ohos_sle_connection_manager.h"
#include "iot_uart.h"
#include "pinctrl.h"
#include "uart.h"
#include "errcode.h"
#include <stdlib.h>
#include <stdio.h>
// #include "adc.h"
// #include "iot_gpio.h"
// #include "iot_gpio_ex.h"
// #include "iot_pwm.h"  
#define OCTET_BIT_LEN 8
#define UUID_LEN_2 2
#define UUID_INDEX 14
#define BT_INDEX_4     4
#define BT_INDEX_0     0
#define UART_BUFF_LENGTH    520
#define SLE_MTU_SIZE_DEFAULT 520
/* 广播ID */
#define SLE_ADV_HANDLE_DEFAULT                    1
/* sle server app uuid for test */
static char g_sle_uuid_app_uuid[UUID_LEN_2] = { 0x12, 0x34 };
/* server notify property uuid for test */
static char g_sle_property_value[OCTET_BIT_LEN] = { 0x0, 0x0, 0x0, 0x0, 0x0, 0x0 };
/* sle connect acb handle */
static uint16_t g_sle_conn_hdl = 0;
/* sle server handle */
static uint8_t g_server_id = 0;
/* sle service handle */
static uint16_t g_service_handle = 0;
/* sle ntf property handle */
static uint16_t g_property_handle = 0;
/* sle pair acb handle */
uint16_t g_sle_pair_hdl;

uint8_t receive_buf[UART_BUFF_LENGTH] = { 0 }; /* max receive length. */
#define UUID_16BIT_LEN 2
#define UUID_128BIT_LEN 16
#define osal_printk(fmt, args...) osal_printk(fmt, ##args)
#define SLE_UART_SERVER_LOG "[sle uart server]"
#define SLE_SERVER_INIT_DELAY_MS    1000
#define SLE_UART_TRANSFER_SIZE              256

static uint8_t g_sle_uart_base[] = { 0x37, 0xBE, 0xA8, 0x80, 0xFC, 0x70, 0x11, 0xEA, 
    0xB7, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
static uint8_t g_at_pre_char = 0;
static uint32_t g_at_uart_recv_cnt = 0;

static uint8_t g_app_uart_rx_buff[SLE_UART_TRANSFER_SIZE] = { 0 };

static uart_buffer_config_t g_app_uart_buffer_config = {
    .rx_buffer = g_app_uart_rx_buff,
    .rx_buffer_size = SLE_UART_TRANSFER_SIZE
};
uint32_t g_gas_data = 0;
uint8_t conn_state_flag = 0;
char data_s[10];
static char *itoa(char *p, unsigned x) {
	p += 3*sizeof(int);
	*--p = 0;
	do {
		*--p = '0' + x % 10;
		x /= 10;
	} while (x);
	return p;
}

// void InitBeep(void)
// {
//     // 初始化GPIO模块
//     IoTGpioInit(1);     
//     IoSetFunc(9, 1);
//     // 初始化PWM模块
//     IoTPwmInit(1);

// }
// void InitMQ2(void){
//     uapi_adc_init(ADC_CLOCK_NONE);
// }
static void server_uart_rx_callback(const void *buffer, uint16_t length, bool error)
{
    errcode_t ret;
    if(length > 0){
        ret = uart_sle_send_data((uint8_t *)buffer,(uint8_t)length);
        if(ret != 0){
        osal_printk("\r\nsle_server_send_data_fail:%d\r\n", ret);
    }
}

}

static void uart_init_config(void)
{
    uart_attr_t attr = {
        .baud_rate = 115200,
        .data_bits = UART_DATA_BIT_8,
        .stop_bits = UART_STOP_BIT_1,
        .parity = UART_PARITY_NONE
    };

    uart_pin_config_t pin_config = {
        .tx_pin = 0,
        .rx_pin = 0,
        .cts_pin = PIN_NONE,
        .rts_pin = PIN_NONE
    };
    uapi_uart_deinit(0);
    uapi_uart_init(0, &pin_config, &attr, NULL, &g_app_uart_buffer_config);
      //UART_RX_CONDITION_FULL_OR_IDLE作为UART在数据接收的时候触发回调的条件，串口接收的字节数不能为16的整数倍，否则需要再发送一个字节的数据才能触发串口接收回调
      (void)uapi_uart_register_rx_callback(0, UART_RX_CONDITION_FULL_OR_IDLE,
                                         1, server_uart_rx_callback);
}




static void encode2byte_little(uint8_t *_ptr, uint16_t data)
{
    *(uint8_t *)((_ptr) + 1) = (uint8_t)((data) >> 0x8);
    *(uint8_t *)(_ptr) = (uint8_t)(data);
}

static void sle_uuid_set_base(SleUuid *out)
{
    errcode_t ret;
    ret = memcpy_s(out->uuid, SLE_UUID_LEN, g_sle_uart_base, SLE_UUID_LEN);
    if (ret != EOK) {
        osal_printk("%s sle_uuid_set_base memcpy fail\n", SLE_UART_SERVER_LOG);
        out->len = 0;
        return ;
    }
    out->len = UUID_LEN_2;
}

static void sle_uuid_setu2(uint16_t u2, SleUuid *out)
{
    sle_uuid_set_base(out);
    out->len = UUID_LEN_2;
    encode2byte_little(&out->uuid[UUID_INDEX], u2);
}
static void sle_uart_uuid_print(SleUuid *uuid)
{
    if (uuid == NULL) {
        osal_printk("%s uuid_print,uuid is null\r\n", SLE_UART_SERVER_LOG);
        return;
    }
    if (uuid->len == UUID_16BIT_LEN) {
        osal_printk("%s uuid: %02x %02x.\n", SLE_UART_SERVER_LOG,
            uuid->uuid[14], uuid->uuid[15]); /* 14 15: uuid index */
    } else if (uuid->len == UUID_128BIT_LEN) {
        osal_printk("%s uuid: \n", SLE_UART_SERVER_LOG); /* 14 15: uuid index */
        osal_printk("%s 0x%02x 0x%02x 0x%02x \n", SLE_UART_SERVER_LOG, uuid->uuid[0], uuid->uuid[1],
            uuid->uuid[2], uuid->uuid[3]);
        osal_printk("%s 0x%02x 0x%02x 0x%02x \n", SLE_UART_SERVER_LOG, uuid->uuid[4], uuid->uuid[5],
            uuid->uuid[6], uuid->uuid[7]);
        osal_printk("%s 0x%02x 0x%02x 0x%02x \n", SLE_UART_SERVER_LOG, uuid->uuid[8], uuid->uuid[9],
            uuid->uuid[10], uuid->uuid[11]);
        osal_printk("%s 0x%02x 0x%02x 0x%02x \n", SLE_UART_SERVER_LOG, uuid->uuid[12], uuid->uuid[13],
            uuid->uuid[14], uuid->uuid[15]);
    }
}

static void ssaps_mtu_changed_cbk(uint8_t server_id, uint16_t conn_id,  SsapcExchangeInfo *mtu_size,
    errcode_t status)
{
    osal_printk("%s ssaps ssaps_mtu_changed_cbk callback server_id:%x, conn_id:%x, mtu_size:%x, status:%x\r\n",
        SLE_UART_SERVER_LOG, server_id, conn_id, mtu_size->mtuSize, status);
    if (g_sle_pair_hdl == 0) {
        g_sle_pair_hdl = conn_id + 1;
    }
}

static void ssaps_start_service_cbk(uint8_t server_id, uint16_t handle, errcode_t status)
{
    osal_printk("%s start service cbk callback server_id:%d, handle:%x, status:%x\r\n", SLE_UART_SERVER_LOG,
        server_id, handle, status);
}
static void ssaps_add_service_cbk(uint8_t server_id, SleUuid *uuid, uint16_t handle, errcode_t status)
{
    osal_printk("%s add service cbk callback server_id:%x, handle:%x, status:%x\r\n", SLE_UART_SERVER_LOG,
        server_id, handle, status);
    sle_uart_uuid_print(uuid);
}
static void ssaps_add_property_cbk(uint8_t server_id, SleUuid *uuid, uint16_t service_handle,
    uint16_t handle, errcode_t status)
{
    osal_printk("%s add property cbk callback server_id:%x, service_handle:%x,handle:%x, status:%x\r\n",
        SLE_UART_SERVER_LOG, server_id, service_handle, handle, status);
    sle_uart_uuid_print(uuid);
}
static void ssaps_add_descriptor_cbk(uint8_t server_id, SleUuid *uuid, uint16_t service_handle,
    uint16_t property_handle, errcode_t status)
{
    osal_printk("%s add descriptor cbk callback server_id:%x, service_handle:%x, property_handle:%x, \
        status:%x\r\n", SLE_UART_SERVER_LOG, server_id, service_handle, property_handle, status);
    sle_uart_uuid_print(uuid);
}
static void ssaps_delete_all_service_cbk(uint8_t server_id, errcode_t status)
{
    osal_printk("%s delete all service callback server_id:%x, status:%x\r\n", SLE_UART_SERVER_LOG,
        server_id, status);
}
static errcode_t sle_ssaps_register_cbks(SsapsReadRequestCallback ssaps_read_callback, SsapsWriteRequestCallback
    ssaps_write_callback)
{
    errcode_t ret;
    SsapsCallbacks ssaps_cbk = {0};
    ssaps_cbk.addServiceCb = ssaps_add_service_cbk;
    ssaps_cbk.addPropertyCb = ssaps_add_property_cbk;
    ssaps_cbk.addDescriptorCb = ssaps_add_descriptor_cbk;
    ssaps_cbk.startServiceCb = ssaps_start_service_cbk;
    ssaps_cbk.deleteAllServiceCb = ssaps_delete_all_service_cbk;
    ssaps_cbk.mtuChangedCb = ssaps_mtu_changed_cbk;
    ssaps_cbk.readRequestCb = ssaps_read_callback;
    ssaps_cbk.writeRequestCb = ssaps_write_callback;
    ret = SsapsRegisterCallbacks(&ssaps_cbk);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_ssaps_register_cbks,ssaps_register_callbacks fail :%x\r\n", SLE_UART_SERVER_LOG,
            ret);
        return ret;
    }
    return ERRCODE_SLE_SUCCESS;
}

static errcode_t sle_uuid_server_service_add(void)
{
    errcode_t ret;
    SleUuid service_uuid = {0};
    sle_uuid_setu2(SLE_UUID_SERVER_SERVICE, &service_uuid);
    ret = SsapsAddServiceSync(g_server_id, &service_uuid, 1, &g_service_handle);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle uuid add service fail, ret:%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ERRCODE_SLE_FAIL;
    }
    return ERRCODE_SLE_SUCCESS;
}

static errcode_t sle_uuid_server_property_add(void)
{
    errcode_t ret;
    SsapsPropertyInfo property = {0};
    SsapsDescInfo descriptor = {0};
    uint8_t ntf_value[] = { 0x01, 0x02 };

    property.permissions = SLE_UUID_TEST_PROPERTIES;
    property.operateIndication = SLE_UUID_TEST_OPERATION_INDICATION;
    sle_uuid_setu2(SLE_UUID_SERVER_NTF_REPORT, &property.uuid);
    property.valueLen = OCTET_BIT_LEN;
    property.value = (uint8_t *)osal_vmalloc(sizeof(g_sle_property_value));
    
    if (property.value == NULL) {
        return ERRCODE_SLE_FAIL;
    }
    if (memcpy_s(property.value, sizeof(g_sle_property_value), g_sle_property_value,
        sizeof(g_sle_property_value)) != EOK) {
        osal_vfree(property.value);
        return ERRCODE_SLE_FAIL;
    }
    ret = SsapsAddPropertySync(g_server_id, g_service_handle, &property,  &g_property_handle);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle uart add property fail, ret:%x\r\n", SLE_UART_SERVER_LOG, ret);
        osal_vfree(property.value);
        return ERRCODE_SLE_FAIL;
    }
    descriptor.permissions = SLE_UUID_TEST_DESCRIPTOR;
    descriptor.type = SSAP_DESCRIPTOR_CLIENT_CONFIGURATION;
    descriptor.operateIndication = SLE_UUID_TEST_OPERATION_INDICATION;
    descriptor.value = (uint8_t *)osal_vmalloc(sizeof(ntf_value));
    if (descriptor.value == NULL) {
        osal_vfree(property.value);
        return ERRCODE_SLE_FAIL;
    }
    if (memcpy_s(descriptor.value, sizeof(ntf_value), ntf_value, sizeof(ntf_value)) != EOK) {
        osal_vfree(property.value);
        osal_vfree(descriptor.value);
        return ERRCODE_SLE_FAIL;
    }
    ret = SsapsAddDescriptorSync(g_server_id, g_service_handle, g_property_handle, &descriptor);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle uart add descriptor fail, ret:%x\r\n", SLE_UART_SERVER_LOG, ret);
        osal_vfree(property.value);
        osal_vfree(descriptor.value);
        return ERRCODE_SLE_FAIL;
    }
    osal_vfree(property.value);
    osal_vfree(descriptor.value);
    return ERRCODE_SLE_SUCCESS;
}

static errcode_t sle_uart_server_add(void)
{
    errcode_t ret;
    SleUuid app_uuid = {0};
    osal_printk("%s sle uart add service in\r\n", SLE_UART_SERVER_LOG);
    app_uuid.len = sizeof(g_sle_uuid_app_uuid);
    if (memcpy_s(app_uuid.uuid, app_uuid.len, g_sle_uuid_app_uuid, sizeof(g_sle_uuid_app_uuid)) != EOK) {
        return ERRCODE_SLE_FAIL;
    }
    SsapsRegisterServer(&app_uuid, &g_server_id);

    if (sle_uuid_server_service_add() != ERRCODE_SLE_SUCCESS) {
       SsapsUnregisterServer(g_server_id);
        return ERRCODE_SLE_FAIL;
    }
    if (sle_uuid_server_property_add() != ERRCODE_SLE_SUCCESS) {
        SsapsUnregisterServer(g_server_id);
        return ERRCODE_SLE_FAIL;
    }
    osal_printk("%s sle uart add service, server_id:%x, service_handle:%x, property_handle:%x\r\n",
        SLE_UART_SERVER_LOG, g_server_id, g_service_handle, g_property_handle);
    ret = SsapsStartService(g_server_id, g_service_handle);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle uart add service fail, ret:%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ERRCODE_SLE_FAIL;
    }
    osal_printk("%s sle uart add service out\r\n", SLE_UART_SERVER_LOG);
    return ERRCODE_SLE_SUCCESS;
}

/* device通过handle向host发送数据：report */
errcode_t sle_uart_server_send_report_by_handle(const uint8_t *data, uint8_t len)
{
    SsapsNtfInd param = {0};
    
    param.handle = g_property_handle;
    param.type = SSAP_PROPERTY_TYPE_VALUE;
    param.value = receive_buf;
    param.valueLen = len+1;
    if (memcpy_s(param.value, param.valueLen, data, len) != EOK) {
        return ERRCODE_SLE_FAIL;
    }
    return  SsapsNotifyIndicate(g_server_id, g_sle_conn_hdl, &param);
}

static void sle_connect_state_changed_cbk(uint16_t conn_id, const SleAddr *addr,
    SleAcbStateType conn_state, SlePairStateType pair_state, SleDiscReasonType disc_reason)
{
    uint8_t sle_connect_state[] = "sle_dis_connect";
    osal_printk("%s connect state changed callback conn_id:0x%02x, conn_state:0x%x, pair_state:0x%x, \
        disc_reason:0x%x\r\n", SLE_UART_SERVER_LOG,conn_id, conn_state, pair_state, disc_reason);
    osal_printk("%s connect state changed callback addr:%02x:**:**:**:%02x:%02x\r\n", SLE_UART_SERVER_LOG,
        addr->addr[BT_INDEX_0], addr->addr[BT_INDEX_4]);
    if (conn_state == OH_SLE_ACB_STATE_CONNECTED) {
        g_sle_conn_hdl = conn_id;
        ssap_exchange_info_t parameter = { 0 };
        parameter.mtu_size = SLE_MTU_SIZE_DEFAULT;
        parameter.version = 1;
        ssaps_set_info(g_server_id, &parameter);
        conn_state_flag = 1;
    } else if (conn_state == OH_SLE_ACB_STATE_DISCONNECTED) {
        g_sle_conn_hdl = 0;
        g_sle_pair_hdl = 0;
        SleStartAnnounce(SLE_ADV_HANDLE_DEFAULT);
        conn_state_flag = 0;
    }
}

static void sle_pair_complete_cbk(uint16_t conn_id, const SleAddr *addr, errcode_t status)
{
    osal_printk("%s pair complete conn_id:%02x, status:%x\r\n", SLE_UART_SERVER_LOG,
        conn_id, status);
    osal_printk("%s pair complete addr:%02x:**:**:**:%02x:%02x\r\n", SLE_UART_SERVER_LOG,
        addr->addr[BT_INDEX_0], addr->addr[BT_INDEX_4]);
    g_sle_pair_hdl = conn_id + 1;
}

static errcode_t sle_conn_register_cbks(void)
{
    errcode_t ret;
    SleConnectionCallbacks conn_cbks = {0};
    conn_cbks.connectStateChangedCb = sle_connect_state_changed_cbk;
    conn_cbks.pairCompleteCb = sle_pair_complete_cbk;
    ret = SleConnectionRegisterCallbacks(&conn_cbks);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_conn_register_cbks,sle_connection_register_callbacks fail :%x\r\n",
        SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    return ERRCODE_SLE_SUCCESS;
}



void ssaps_read_request_callbacks(uint8_t server_id, uint16_t conn_id, ssaps_req_read_cb_t *read_cb_para,
    errcode_t status){
        (void)server_id;
        (void)conn_id;
        (void)read_cb_para;
        (void)status;

    }

void ssaps_write_request_callbacks(uint8_t server_id, uint16_t conn_id, ssaps_req_write_cb_t *write_cb_para,
    errcode_t status){
      (void)server_id;
        (void)conn_id;
        (void)status;
         write_cb_para->value[write_cb_para->length-1] = '\0';
   osal_printk("client_send_data: %s\r\n",write_cb_para->value);
    smart_restroom_process_cmd(write_cb_para->value,strlen(write_cb_para->value));
    }


/* 初始化uuid server */
errcode_t sle_uart_server_init()
{
    errcode_t ret;
    ret = sle_uart_announce_register_cbks();
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_uart_server_init,sle_uart_announce_register_cbks fail :%x\r\n",
        SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    ret = sle_conn_register_cbks();
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_uart_server_init,sle_conn_register_cbks fail :%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    ret = sle_ssaps_register_cbks(ssaps_read_request_callbacks, ssaps_write_request_callbacks);
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_uart_server_init,sle_ssaps_register_cbks fail :%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    ret = EnableSle();
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_uart_server_init,enable_sle fail :%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    osal_printk("%s init ok\r\n", SLE_UART_SERVER_LOG);
    return ERRCODE_SLE_SUCCESS;
}

errcode_t sle_enable_server_cbk(void)
{
    errcode_t ret;
    ret = sle_uart_server_add();
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_uart_server_init,sle_uart_server_add fail :%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    ret = sle_uart_server_adv_init();
    if (ret != ERRCODE_SLE_SUCCESS) {
        osal_printk("%s sle_uart_server_init,sle_uart_server_adv_init fail :%x\r\n", SLE_UART_SERVER_LOG, ret);
        return ret;
    }
    return ERRCODE_SLE_SUCCESS;
}





int uart_sle_send_data(uint8_t *data,uint8_t length){
    int ret;
    ret = sle_uart_server_send_report_by_handle(data,length);
    return ret ;
}


// uint8_t beep_on_flag = 0;
// static void SleTask( char* arg)
// {
//     (void)arg;
//     usleep(1000000);
//     uart_init_config();
//     sle_uart_server_init();
//     // InitBeep();
//     // InitMQ2();
  
//     while (1)
//     {
//         if (conn_state_flag)
//         {
//             //读取MQ-2传感器数值（ADC4）
//             adc_port_read(4, &g_gas_data);
//             if(g_gas_data > 1000&&beep_on_flag == 0){
//                 beep_on_flag = 1;
//                 IoTPwmStart(1, 50, 2000);   
//             }else if(g_gas_data < 1000&&beep_on_flag == 1){
//                 beep_on_flag = 0;
//                 IoTPwmStop(1);
//                 uapi_pwm_clear_group(1);
//             }
//             sle_uart_server_send_report_by_handle(itoa(data_s,g_gas_data),strlen(itoa(data_s,g_gas_data)));
//         }
        
//         osDelay(10);
//     }
    
//     return NULL;
// }

// static void SleServerExample(void)
// {
//     osThreadAttr_t attr;

//     attr.name = "SleTask";
//     attr.attr_bits = 0U;
//     attr.cb_mem = NULL;
//     attr.cb_size = 0U;
//     attr.stack_mem = NULL;
//     attr.stack_size = 1024 *3;
//     attr.priority = 25;

//     if (osThreadNew(SleTask, NULL, &attr) == NULL) {
//           osal_printk("[SleExample] Falied to create SleTask!\n");
//     }else osal_printk("[SleExample]  create SleTask successfully !\n");
// }

// SYS_RUN(SleServerExample); // if test add it