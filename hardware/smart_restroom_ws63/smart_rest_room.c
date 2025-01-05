/*
 * Copyright (c) 2020-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <stdio.h>
#include <unistd.h>
#include "ohos_init.h"
// #include "cmsis_os2.h"
// #include "iot_gpio.h"
#include "gpio.h"
#include "soc_osal.h"
#include "pinctrl.h"
#include "drv_lock.h"
#include "drv_led.h"
#include "beep.h"
#include "i2c.h"
#include "osal_debug.h"
#include "oled.h"
#include "oledfont.h"
#include "gui.h"
#include "drv_buttons.h"
#include "cJSON.h"


#define DEV_SN  "120200001"
#define LED_INTERVAL_TIME_US 300000
#define LED_TASK_STACK_SIZE 512
#define LED_TASK_PRIO 25
#define LED_TEST_GPIO 10 // for hispark_pegasus
#define BSP_LED 7 // for hispark_pegasus

enum LockState {
    LOCK_IDLE = 0,
    LOCK_LIN ,
    LOCK_RIN ,
    LOCK_FORBID_ALL ,
    LOCK_FORBID_LEFT ,
    LOCK_FORBID_RIGHT
};

enum LockState g_LockState = LOCK_IDLE;
enum LockState g_lockSetting = LOCK_IDLE;
int is_smoke=false;
int light_state = false;
int is_urgency = false;
int is_exception = false;


static void *buttonTask(const char *arg)
{
    (void)arg;
    osal_printk(">>> buttonTask.\n");

    button_init();

    while(1){
        int pushed_btn = button_scan();
        switch (pushed_btn) {
        case BUTTON_LIN:
            osal_printk("BUTTON_LIIN\r\n");
            if(g_LockState == LOCK_IDLE){

                open_lock(1);
                g_LockState = LOCK_LIN;
            }
            break;
        case BUTTON_LOUT:
            osal_printk("BUTTON_LOUT\r\n");
            if(g_LockState == LOCK_LIN){
                open_lock(1);
                g_LockState = LOCK_IDLE;
            }
            break;
        case BUTTON_RIN:
           osal_printk("BUTTON_RIIN\r\n");
           if(g_LockState == LOCK_IDLE){
                open_lock(3);
                g_LockState = LOCK_RIN;
           }
            break;
        case BUTTON_ROUT:
            osal_printk("BUTTON_ROUT\r\n");
            if(g_LockState == LOCK_RIN){
                open_lock(3);
                g_LockState = LOCK_IDLE;
            }
            break;
        case BUTTON_PAPER:
            osal_printk("BUTTON_PAPER\r\n");
            motor_control(0,1);
            osal_msleep(5000);
            osal_printk(">>>>>>>>BUTTON_PAPER\r\n");
            motor_control(0,0);
            break;
        case BUTTON_URGENCY:
           osal_printk("BUTTON_URGENCY\r\n");
           led_control(LED_RED,1);
            break;
        case BUTTON_LIGHT:
           osal_printk("BUTTON_LIGHT\r\n");
           led_control(LED_LIGHT,1);
            break;

        default:
            
            break;
        }
        osal_msleep(100);
    }
    

    return NULL;
}

void smart_restroom_process_cmd(uint8_t *data,int len)
{
    
    cJSON *root = cJSON_Parse(data);
    if(root != NULL){

        cJSON *cmd_name_obj = cJSON_GetObjectItem(root,"command_name");
        if(cmd_name_obj != NULL){
            char *cmd_name_str = cJSON_GetStringValue(cmd_name_obj);
            /* light   fan*/
            if(strcmp(cmd_name_str,"light_cmd") == 0){
                /* light cmd*/
                cJSON *paras_obj = cJSON_GetObjectItem(root,"paras");
                if(paras_obj != NULL){
                    cJSON *paras_item=cJSON_GetObjectItem(paras_obj,"onoff");
                    if(paras_item != NULL){
                        char *onoff = cJSON_GetStringValue(paras_item);
                        printf("light onoff cmd is :%s\n",onoff);

                        if(strcmp(onoff,"ON") == 0){
                            printf("turn on the light\n");
                             led_control(LED_LIGHT,1);
                            
                        }else if(strcmp(onoff,"OFF") == 0){
                            printf("turn off the light\n");
                            
                             led_control(LED_LIGHT,0);
                        }
                    }
                }
            }
            if(strcmp(cmd_name_str,"lock_cmd") == 0){
                /* light cmd*/
                cJSON *paras_obj = cJSON_GetObjectItem(root,"paras");
                if(paras_obj != NULL){
                    cJSON *paras_item=cJSON_GetObjectItem(paras_obj,"onoff");
                    if(paras_item != NULL){
                        char *onoff = cJSON_GetStringValue(paras_item);
                        printf("light onoff cmd is :%s\n",onoff);

                        if(strcmp(onoff,"LEFT_OPEN") == 0){                            
                            open_lock(1);
                        }else if(strcmp(onoff,"RIGHT_OPEN") == 0){                            
                            open_lock(3);
                        }
                        
                    }
                }
            }
          

        }
        cJSON_Delete(root);
    }
    
}

#define CONFIG_I2C_SCL_MASTER_PIN 15
#define CONFIG_I2C_SDA_MASTER_PIN 16
#define CONFIG_I2C_MASTER_PIN_MODE 2

void app_i2c_init_pin(void)
{
    uapi_pin_set_mode(CONFIG_I2C_SCL_MASTER_PIN, CONFIG_I2C_MASTER_PIN_MODE);
    uapi_pin_set_mode(CONFIG_I2C_SDA_MASTER_PIN, CONFIG_I2C_MASTER_PIN_MODE);
}
char sendbuff[300];

static void *mainTask(const char *arg)
{

    unused(arg);
    sle_uart_server_init();

    app_i2c_init_pin();
    errcode_t ret = uapi_i2c_master_init(1, 400000, 0);
    if (ret != 0) {
        osal_printk("i2c init failed, ret = %0x\r\n", ret);
    }
    AHT20_Calibrate();
    smoke_init();
    motor_init(0);

    led_init(LED_RED);
    led_init(LED_LIGHT);
    
    OLED_Init();
    beep_init();
    // beep_music(Victory_Music,sizeof(Victory_Music));
    GUI_ShowString(20,0,"Smart Restroom",8,1);
    OLED_Display();

    lock_init();

    while (1) {
        float temp;
        float humi;
        uint16_t smoke;

        char temp_str[20]={0};
        char humi_str[20]={0};
        char lock_str[30]={0};
        AHT20_StartMeasure();
        osal_mdelay(100);
        AHT20_GetMeasureResult(&temp, &humi);
        smoke = somke_getValue();
        osal_printk(">>> smoke=%d\n",smoke);
        if(smoke > 1000)
        {
            is_smoke = true;
            beep_music(Victory_Music,sizeof(Victory_Music));
        }else{
            is_smoke = false;
        }
        int state = get_lock_state(LOCK_LEFT_PORT) & get_lock_state(LOCK_RIGHT_PORT);
        osal_printk(">>> state=%d\n",state);

        // osal_printk(">>> temp:%d,humi:%d\n",(int)temp*10,(int)humi*10);
        sprintf(temp_str,"温度:%.02f",temp);
        sprintf(humi_str,"湿度:%.02f",humi);
        sprintf(lock_str,"门锁:%s",state==0 ? "开启":"关闭"  );

        showText(0,8,16,temp_str);
        showText(0,24,16,humi_str);
        showText(0,40,16,lock_str);
       
        OLED_Display();

        cJSON *root = cJSON_CreateObject();
        

        if(root != NULL){

            cJSON *serv_arr = cJSON_AddArrayToObject(root, "services");
            cJSON *arr_item =  cJSON_CreateObject();

            cJSON_AddStringToObject(arr_item,"service_id","restroom");

            cJSON *pro_obj = cJSON_CreateObject();
            cJSON_AddItemToObject(arr_item,"properties",pro_obj);

            cJSON_AddStringToObject(pro_obj,"dev_sn",DEV_SN);
            cJSON_AddNumberToObject(pro_obj,"temp",temp);
            cJSON_AddNumberToObject(pro_obj,"humi",humi);

            cJSON_AddBoolToObject(pro_obj,"smoke",is_smoke?true:false);
            cJSON_AddBoolToObject(pro_obj,"urgency",is_urgency?true:false);
            cJSON_AddBoolToObject(pro_obj,"exception",is_exception?true:false);

            cJSON_AddStringToObject(pro_obj,"light",light_state?"ON":"OFF");
            cJSON_AddStringToObject(pro_obj,"lock",g_LockState?"IN_USE":"IDLE");


            cJSON_AddItemToArray(serv_arr,arr_item);

            char *palyload_str = cJSON_PrintUnformatted(root);

            strcpy(sendbuff,palyload_str);

            cJSON_free(palyload_str);
            cJSON_Delete(root);

        }
        //发送到客户端
        sle_uart_server_send_report_by_handle(sendbuff,strlen(sendbuff));

        osal_mdelay(3000);


    }
    return NULL;
}


#define BLINKY_TASK_PRIO          24
#define BLINKY_TASK_STACK_SIZE    0x1000

static void smartResetRoomDemo(void)
{
   
    osal_printk(">>> smart rest room demo start.\n");
    uapi_watchdog_disable();
    osal_task *task_handle = NULL;
    osal_kthread_lock();
 
    task_handle = osal_kthread_create((osal_kthread_handler)buttonTask, 0, "BTNS", BLINKY_TASK_STACK_SIZE);
    if (task_handle != NULL) {
        osal_kthread_set_priority(task_handle, 20);
        osal_kfree(task_handle);
    }
    task_handle = osal_kthread_create((osal_kthread_handler)mainTask, 0, "main", BLINKY_TASK_STACK_SIZE);
    if (task_handle != NULL) {
        osal_kthread_set_priority(task_handle, 20);
        osal_kfree(task_handle);
    }
    osal_kthread_unlock();
}


SYS_RUN(smartResetRoomDemo);
