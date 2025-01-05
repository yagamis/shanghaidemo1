#include "gpio.h"
#include "soc_osal.h"
#include "pinctrl.h"
#include "adc.h"
#include "adc_porting.h"
#include "drv_buttons.h"
#include <stdbool.h>

#define BUTTON1_CH  5
#define BUTTON2_CH  3


void button_init(int index)
{
    uapi_adc_init(ADC_CLOCK_500KHZ);                    //初始化ADC
    uapi_adc_power_en(AFE_SCAN_MODE_MAX_NUM, true);     //使能ADC

    uapi_adc_open_channel(BUTTON1_CH);
    uapi_adc_open_channel(BUTTON2_CH);

}


int button_scan()
{
    uint16_t val1=0;
    uint16_t val2=0;


    int pushed_btn = NO_BUTTON;
    static int pressed_btn1 = false;
    static int pressed_btn2 = false;

    adc_port_read(BUTTON1_CH, &val1);
    adc_port_read(BUTTON2_CH, &val2);
    
    // osal_printk("val1 = %d,val2 = %d\r\n",val1,val2);
    
    if(( !pressed_btn1) && (val1>3200)){
        pressed_btn1 = true;
        pushed_btn = BUTTON_ROUT;
    }else if(( !pressed_btn1) &&(val1 >2500)){
        pressed_btn1 = true;
        pushed_btn = BUTTON_RIN;

    }else if(( !pressed_btn1) &&(val1 > 1800)){
        pressed_btn1 = true;
        pushed_btn = BUTTON_LIN;

    }else if(( !pressed_btn1) &&(val1 >1200)){
        pressed_btn1 = true;
        pushed_btn = BUTTON_LOUT;
        
    }else if(( pressed_btn1) &&(val1 <100 )){
        
        pressed_btn1 = false;
        
    }
    
    if(( !pressed_btn2) &&(val2 < 50)){
        pressed_btn2 = true;   
        pushed_btn = BUTTON_PAPER;
    }else if(( !pressed_btn2) &&(val2 < 1200)){
        pressed_btn2 = true;
        pushed_btn = BUTTON_URGENCY;
    }else if(( !pressed_btn2) &&(val2 < 1800)){
        pressed_btn2 = true;
        pushed_btn = BUTTON_LIGHT;
    }else if(( !pressed_btn2) &&(val2 < 2100)){
        pressed_btn2 = true;

    }else if(( !pressed_btn2) &&(val2 < 2600)){
        pressed_btn2 = true;

    }else if(( pressed_btn2) &&(val2> 3000 )){
        
        pressed_btn2 = false;
        
    }
    // osal_printk("pushed_btn = %d\r\n",pushed_btn);
    return pushed_btn;

}