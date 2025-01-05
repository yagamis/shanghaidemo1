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
#include "string.h"
#include "common_def.h"
#include "osal_debug.h"
#include "osal_task.h"
#include "cmsis_os2.h"
#include "securec.h"
#include "sle_device_discovery.h"
#include "sle_connection_manager.h"
#include "sle_ssap_client.h"
#include "sle_uart_client.h"
#include "sle_errcode.h"
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

#define SLE_MTU_SIZE_DEFAULT 520
#define SLE_SEEK_INTERVAL_DEFAULT 100
#define SLE_SEEK_WINDOW_DEFAULT 100
#define UUID_16BIT_LEN 2
#define UUID_128BIT_LEN 16
#define SLE_UART_TASK_DELAY_MS 1000
#define SLE_UART_WAIT_SLE_CORE_READY_MS 5000
#ifndef SLE_UART_SERVER_NAME
#define SLE_UART_SERVER_NAME "sle_uart_server"
#endif
#define SLE_UART_CLIENT_LOG  "[sle uart client]"
#define UUID_LEN_2     2
static char g_sle_uuid_app_uuid[] = { 0x39, 0xBE, 0xA8, 0x80, 0xFC, 0x70, 0x11, 0xEA, 
    0xB7, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
static unsigned char uartReadBuff[100];
static ssapc_find_service_result_t g_sle_uart_find_service_result = { 0 };
static sle_announce_seek_callbacks_t g_sle_uart_seek_cbk = { 0 };
static SleConnectionCallbacks g_sle_uart_connect_cbk = { 0 };
static ssapc_callbacks_t g_sle_uart_ssapc_cbk = { 0 };
static SleAddr g_sle_uart_remote_addr = { 0 };
ssapc_write_param_t g_sle_uart_send_param = { 0 };
uint16_t g_sle_uart_conn_id = 0;
static uint8_t g_client_id = 0;
static uint8_t g_at_pre_char = 0;
static uint32_t g_at_uart_recv_cnt = 0;
#define SLE_UART_TRANSFER_SIZE              256
static uint8_t g_app_uart_rx_buff[SLE_UART_TRANSFER_SIZE] = { 0 };
static uint8_t receive_buf[520] = { 0 }; /* max receive length. */
static uart_buffer_config_t g_app_uart_buffer_config = {
    .rx_buffer = g_app_uart_rx_buff,
    .rx_buffer_size = SLE_UART_TRANSFER_SIZE
};
uint16_t get_g_sle_uart_conn_id(void)
{
    return g_sle_uart_conn_id;
}

ssapc_write_param_t *get_g_sle_uart_send_param(void)
{
    return &g_sle_uart_send_param;
}

static void uart_rx_callback(const void *buffer, uint16_t length, bool error)
{
    errcode_t ret;
   

    if(length > 0){
        ret = uart_sle_client_send_data((uint8_t *)buffer,(uint8_t)length);
        if(ret != 0){
        printf("\r\nsle_client_send_data_fail:%d\r\n", ret);
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
                                         1, uart_rx_callback);
}


void sle_uart_start_scan(void)
{
    SleSeekParam param = { 0 };
    param.ownaddrtype = 0;
    param.filterduplicates = 0;
    param.seekfilterpolicy = 0;
    param.seekphys = 1;
    param.seekType[0] = 1;
    param.seekInterval[0] = SLE_SEEK_INTERVAL_DEFAULT;
    param.seekWindow[0] = SLE_SEEK_WINDOW_DEFAULT;
    SleSetSeekParam(&param);
    SleStartSeek();
}

static void sle_uart_client_sample_sle_enable_cbk(errcode_t status)
{
    if (status != 0) {
        printf("%s sle_uart_client_sample_sle_enable_cbk,status error\r\n", SLE_UART_CLIENT_LOG);
    } else {
        osal_msleep(SLE_UART_TASK_DELAY_MS);
        sle_uart_start_scan();
    }
}

static void sle_uart_client_sample_seek_enable_cbk(errcode_t status)
{
    if (status != 0) {
        printf("%s sle_uart_client_sample_seek_enable_cbk,status error\r\n", SLE_UART_CLIENT_LOG);
    }
}

static void sle_uart_client_sample_seek_result_info_cbk(SleSeekResultInfo *seek_result_data)
{
    printf("%s sle uart scan data :%s\r\n", SLE_UART_CLIENT_LOG, seek_result_data->data);
    if (seek_result_data == NULL) {
        printf("status error\r\n");
    } else if (strstr((const char *)seek_result_data->data, SLE_UART_SERVER_NAME) != NULL) {
        memcpy_s(&g_sle_uart_remote_addr, sizeof(sle_addr_t), &seek_result_data->addr, sizeof(sle_addr_t));
        SleStopSeek();
     
    }
}

static void sle_uart_client_sample_seek_disable_cbk(errcode_t status)
{
    if (status != 0) {
        printf("%s sle_uart_client_sample_seek_disable_cbk,status error = %x\r\n", SLE_UART_CLIENT_LOG, status);
    } else {
       SleConnectRemoteDevice(&g_sle_uart_remote_addr);
    }
}

static void sle_uart_client_sample_seek_cbk_register(void)
{
    g_sle_uart_seek_cbk.sle_enable_cb = sle_uart_client_sample_sle_enable_cbk;
    g_sle_uart_seek_cbk.seek_enable_cb = sle_uart_client_sample_seek_enable_cbk;
    g_sle_uart_seek_cbk.seek_result_cb = sle_uart_client_sample_seek_result_info_cbk;
    g_sle_uart_seek_cbk.seek_disable_cb = sle_uart_client_sample_seek_disable_cbk;
    sle_announce_seek_register_callbacks(&g_sle_uart_seek_cbk);
}

static void sle_uart_client_sample_connect_state_changed_cbk(uint16_t conn_id, const SleAddr *addr,
    SleAcbStateType conn_state, SlePairStateType pair_state, SleDiscReasonType disc_reason)
{
    unused(addr);
    unused(pair_state);
    printf("%s conn state changed disc_reason:0x%x\r\n", SLE_UART_CLIENT_LOG, disc_reason);
    g_sle_uart_conn_id = conn_id;
    if (conn_state == SLE_ACB_STATE_CONNECTED) {
        printf("%s SLE_ACB_STATE_CONNECTED\r\n", SLE_UART_CLIENT_LOG);
        SsapcExchangeInfo info = {0};
        info.mtuSize = SLE_MTU_SIZE_DEFAULT;
        info.version = 1;
        SsapcExchangeInfoReq(0, conn_id, &info);
        SlePairRemoteDevice(addr);
    } else if (conn_state == SLE_ACB_STATE_NONE) {
        printf("%s SLE_ACB_STATE_NONE\r\n", SLE_UART_CLIENT_LOG);
    } else if (conn_state == SLE_ACB_STATE_DISCONNECTED) {
        printf("%s SLE_ACB_STATE_DISCONNECTED\r\n", SLE_UART_CLIENT_LOG);
        SleRemovePairedRemoteDevice(addr);
        sle_uart_start_scan();
        
    } else {
        printf("%s status error\r\n", SLE_UART_CLIENT_LOG);
    }
   
    
}

static void sle_uart_client_sample_connect_cbk_register(void)
{
    g_sle_uart_connect_cbk.connectStateChangedCb = sle_uart_client_sample_connect_state_changed_cbk;
    SleConnectionRegisterCallbacks(&g_sle_uart_connect_cbk);
}

static void sle_uart_client_sample_exchange_info_cbk(uint8_t client_id, uint16_t conn_id, ssap_exchange_info_t *param,
                                                     errcode_t status)
{
    printf("%s exchange_info_cbk,pair complete client id:%d status:%d\r\n",
                SLE_UART_CLIENT_LOG, client_id, status);
    printf("%s exchange mtu, mtu size: %d, version: %d.\r\n", SLE_UART_CLIENT_LOG,
                param->mtu_size, param->version);
    ssapc_find_structure_param_t find_param = { 0 };
    find_param.type = 1;
    find_param.start_hdl = 1;
    find_param.end_hdl = 0xFFFF;
    int ret =  ssapc_find_structure(client_id, conn_id, &find_param);

   printf("ssapc_find_structure_errcode:%d\r\n",ret);
}

static void sle_uart_client_sample_find_structure_cbk(uint8_t client_id, uint16_t conn_id,
                                                      ssapc_find_service_result_t *service,
                                                      errcode_t status)
{
    printf("%s find structure cbk client: %d conn_id:%d status: %d \r\n", SLE_UART_CLIENT_LOG,
                client_id, conn_id, status);
    printf("%s find structure start_hdl:[0x%02x], end_hdl:[0x%02x], uuid len:%d\r\n", SLE_UART_CLIENT_LOG,
                service->start_hdl, service->end_hdl, service->uuid.len);
    g_sle_uart_find_service_result.start_hdl = service->start_hdl;
    g_sle_uart_find_service_result.end_hdl = service->end_hdl;
    memcpy_s(&g_sle_uart_find_service_result.uuid, sizeof(sle_uuid_t), &service->uuid, sizeof(sle_uuid_t));


}

static void sle_uart_client_sample_find_property_cbk(uint8_t client_id, uint16_t conn_id,
                                                     ssapc_find_property_result_t *property, errcode_t status)
{
    printf("%s sle_uart_client_sample_find_property_cbk, client id: %d, conn id: %d, operate ind: %d, "
                "descriptors count: %d status:%d property->handle %d\r\n", SLE_UART_CLIENT_LOG,
                client_id, conn_id, property->operate_indication,
                property->descriptors_count, status, property->handle);
    g_sle_uart_send_param.handle = property->handle;
    g_sle_uart_send_param.type = SSAP_PROPERTY_TYPE_VALUE;
}

static void sle_uart_client_sample_find_structure_cmp_cbk(uint8_t client_id, uint16_t conn_id,
                                                          ssapc_find_structure_result_t *structure_result,
                                                          errcode_t status)
{
    unused(conn_id);


    printf("%s sle_uart_client_sample_find_structure_cmp_cbk,client id:%d status:%d type:%d uuid len:%d \r\n",
                SLE_UART_CLIENT_LOG, client_id, status, structure_result->type, structure_result->uuid.len);
}

static void sle_uart_client_sample_write_cfm_cb(uint8_t client_id, uint16_t conn_id,
                                                ssapc_write_result_t *write_result, errcode_t status)
{
    printf("%s sle_uart_client_sample_write_cfm_cb, conn_id:%d client id:%d status:%d handle:%02x type:%02x\r\n",
                SLE_UART_CLIENT_LOG, conn_id, client_id, status, write_result->handle, write_result->type);
}

static void sle_uart_client_sample_ssapc_cbk_register(ssapc_notification_callback notification_cb,
                                                      ssapc_indication_callback indication_cb)
{
    g_sle_uart_ssapc_cbk.exchange_info_cb = sle_uart_client_sample_exchange_info_cbk;
    g_sle_uart_ssapc_cbk.find_structure_cb = sle_uart_client_sample_find_structure_cbk;
    g_sle_uart_ssapc_cbk.ssapc_find_property_cbk = sle_uart_client_sample_find_property_cbk;
    g_sle_uart_ssapc_cbk.find_structure_cmp_cb = sle_uart_client_sample_find_structure_cmp_cbk;
    g_sle_uart_ssapc_cbk.write_cfm_cb = sle_uart_client_sample_write_cfm_cb;
    g_sle_uart_ssapc_cbk.notification_cb = notification_cb;
    g_sle_uart_ssapc_cbk.indication_cb = indication_cb;
    ssapc_register_callbacks(&g_sle_uart_ssapc_cbk);
}


static errcode_t sle_uuid_client_register(void)
{
    errcode_t ret;
    SleUuid app_uuid = {0};

    printf("[uuid client] ssapc_register_client \r\n");
    app_uuid.len = sizeof(g_sle_uuid_app_uuid);
    if (memcpy_s(app_uuid.uuid, app_uuid.len, g_sle_uuid_app_uuid, sizeof(g_sle_uuid_app_uuid)) != EOK) {
        return ERRCODE_SLE_FAIL;
    }
    ret = SsapcRegisterClient(&app_uuid, &g_client_id);

    return ret;
}



/* device通过handle向host发送数据：report */
errcode_t sle_uart_client_send_report_by_handle(const uint8_t *data, uint8_t len)
{
    ssapc_write_param_t param = {0};
   
    param.handle =  g_sle_uart_find_service_result.start_hdl;
    param.type = 0;
    param.data = receive_buf;
    param.data_len = len+1;
    if (memcpy_s(param.data, param.data_len, data, len) != EOK) {
        return ERRCODE_SLE_FAIL;
    }
   
    int ret =SsapWriteReq(g_client_id,g_sle_uart_conn_id, &param);
    return ret;
}


int uart_sle_client_send_data(uint8_t *data,uint8_t length){
    int ret;
    ret = sle_uart_client_send_report_by_handle(data,length);
    return ret ;
}

void ssapc_notification_callbacks(uint8_t client_id, uint16_t conn_id, ssapc_handle_value_t *data,
    errcode_t status){
        (void)client_id;
        (void)conn_id;
        (void)status;
        data->data[data->data_len -1] = '\0';
        printf("gas_data: %s\r\n",data->data);     
    }

void ssapc_indication_callbacks(uint8_t client_id, uint16_t conn_id, ssapc_handle_value_t *data,
    errcode_t status){
        (void)client_id;
        (void)conn_id;
        (void)data;
        (void)status;
    }


void sle_uart_client_init()
{
    uint8_t local_addr[SLE_ADDR_LEN] = { 0x13, 0x67,0x5c, 0x07, 0x00, 0x51 };
    SleAddr local_address;
    local_address.type = 0;
    (void)memcpy_s(local_address.addr, SLE_ADDR_LEN, local_addr, SLE_ADDR_LEN);
    sle_uuid_client_register();
    sle_uart_client_sample_seek_cbk_register();
    sle_uart_client_sample_connect_cbk_register();
    sle_uart_client_sample_ssapc_cbk_register(ssapc_notification_callbacks, ssapc_indication_callbacks);
    EnableSle();
	SleSetLocalAddr(&local_address);
    
}




static void SleTask( char* arg)
{
   (void)arg;
    usleep(1000000);
    uart_init_config();
    sle_uart_client_init();
    return NULL;
}

static void SleClientExample(void)
{
    osThreadAttr_t attr;
    attr.name = "SleTask";
    attr.attr_bits = 0U;
    attr.cb_mem = NULL;
    attr.cb_size = 0U;
    attr.stack_mem = NULL;
    attr.stack_size = 2048;
    attr.priority = 25;

    if (osThreadNew(SleTask, NULL, &attr) == NULL) {
          printf("[SleExample] Falied to create SleTask!\n");
    }else printf("[SleExample]  create SleTask successfully !\n");
}

SYS_RUN(SleClientExample); 