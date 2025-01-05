#include "gpio.h"
#include "soc_osal.h"
#include "pinctrl.h"
#include "adc.h"
#include "adc_porting.h"


void temphumi_init(int index)
{
    

}

void temphumi_getValue(float *temp,float *humi)
{

}
uint32_t adc_val = 0;
void test_adc_callback(uint8_t ch, uint32_t *buffer, uint32_t length, bool *next) 
{ 
    UNUSED(next);

    for (uint32_t i = 0; i < length; i++) {
        osal_printk("channel: %d, voltage: %dmv\r\n", ch, buffer[i]);
        adc_val = buffer[i];
    } 
}


void smoke_init()
{
    adc_scan_config_t config = {.type = 0, .freq = 1};
    
    uapi_adc_init(ADC_CLOCK_500KHZ);                    //初始化ADC
    // uapi_adc_power_en(AFE_SCAN_MODE_MAX_NUM, true);     //使能ADC
    // uapi_adc_open_channel(4);
}

int somke_getValue(float *smoke)
{
    // adc_scan_config_t config = {
    //     .type = 0,
    //     .freq = 1,
    // };
    // uapi_adc_auto_scan_ch_enable(4, config, test_adc_callback);
    // osal_mdelay(50);
    // uapi_adc_auto_scan_ch_disable(4);

    // osal_printk("smoke value=%d \n",val) ;
    uint16_t val;
    adc_port_read(4, &val);

    // osal_printk("smoke value=%d \n",val) ;
    return val;
    // *smoke = adc_val;
}
static void *adc_task(const char *arg)
{
 
}
