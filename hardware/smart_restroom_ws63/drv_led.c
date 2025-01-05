#include "gpio.h"
#include "soc_osal.h"
#include "pinctrl.h"


void led_init(int index)
{
    uapi_gpio_init();
    if(index == 4){
        uapi_pin_set_mode(index, 2);
    }else{
        uapi_pin_set_mode(index, HAL_PIO_FUNC_GPIO);

    }
    gpio_select_core(index, CORES_APPS_CORE);
    uapi_gpio_set_dir(index, GPIO_DIRECTION_OUTPUT);
    uapi_gpio_set_val(index, GPIO_LEVEL_LOW);

}

void led_control(int index,int cmd)
{
    if(cmd == 0){
        uapi_gpio_set_val(index, GPIO_LEVEL_LOW);
    }

    if(cmd == 1){
        uapi_gpio_set_val(index, GPIO_LEVEL_HIGH);
    }

    if(cmd == 2){
        uapi_gpio_toggle(index);
    }
}