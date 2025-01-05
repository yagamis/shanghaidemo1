#ifndef __BEEP_H__
#define __BEEP_H__
#include "stdint.h"

extern uint8_t Victory_Music[3] ;
extern uint8_t GameOver_Music[3] ;
extern uint8_t Jump_Music[1] ;

void beep_init();
void beep_set_freq(uint16_t freq);
void beep_set_duty(uint8_t duty);
void beep_on();
void beep_off();
void beep_music(uint8_t *music,uint8_t num);

#endif