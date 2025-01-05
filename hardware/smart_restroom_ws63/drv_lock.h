#ifndef _DRV_LOCK_H_
#define _DRV_LOCK_H_


#define LOCK_LEFT           1
#define LOCK_RIGHT          2

#define LOCK_LEFT_PORT  2
#define LOCK_RIGHT_PORT 3


void lock_init();
void open_lock(int index);

int get_lock_state(int index);



#endif 

