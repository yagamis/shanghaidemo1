#ifndef _DRV_BUTTONS_H_
#define _DRV_BUTTONS_H_


#define NO_BUTTON          0

#define BUTTON_LIN        1
#define BUTTON_LOUT        2
#define BUTTON_RIN        3
#define BUTTON_ROUT        4

#define BUTTON_PAPER       5
#define BUTTON_URGENCY     6
#define BUTTON_LIGHT       7


void button_init();

int button_scan();



#endif 

