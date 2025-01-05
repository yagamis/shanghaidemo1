#include "gpio.h"
#include "soc_osal.h"
#include "pinctrl.h"

#define MOTOR_PAPER           0

void motor_init(int index)
{
    uapi_gpio_init();
    uapi_pin_set_mode(MOTOR_PAPER, 0);
    gpio_select_core(MOTOR_PAPER, CORES_APPS_CORE);
    uapi_gpio_set_dir(MOTOR_PAPER, GPIO_DIRECTION_OUTPUT);
    uapi_gpio_set_val(MOTOR_PAPER, GPIO_LEVEL_LOW);

}

void motor_control(int index,int cmd)
{
    if(cmd == 0){
        uapi_gpio_set_val(MOTOR_PAPER, GPIO_LEVEL_LOW);
    }

    if(cmd == 1){
        uapi_gpio_set_val(MOTOR_PAPER, GPIO_LEVEL_HIGH);
    }
}