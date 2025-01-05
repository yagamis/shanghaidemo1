#ifndef _DRV_LED_H_
#define _DRV_LED_H_


#define LED_RED             4
#define LED_LIGHT           1



void led_init(int index);

void led_control(int index,int cmd);



#endif 

