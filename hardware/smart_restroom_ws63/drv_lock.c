#include "gpio.h"
#include "soc_osal.h"
#include "pinctrl.h"
#include "uart.h"
#include "drv_lock.h"

#define UNLOCK      0
#define LOCKED      1


#define UART_BAUDRATE                      9600
#define UART_DATA_BITS                     3
#define UART_STOP_BITS                     1
#define UART_PARITY_BIT                    0
#define UART_TRANSFER_SIZE                 16
#define CONFIG_UART_INT_WAIT_MS            5
#define UART_TASK_DURATION_MS              500

#define CONFIG_UART2_TXD_PIN        8
#define CONFIG_UART2_RXD_PIN        7
#define CONFIG_UART_BUS_ID          2


static uint8_t g_app_uart_rx_buff[UART_TRANSFER_SIZE] = { 0 };

static uart_buffer_config_t g_app_uart_buffer_config = {
    .rx_buffer = g_app_uart_rx_buff,
    .rx_buffer_size = UART_TRANSFER_SIZE
};

static void app_uart_init_pin(void)
{
    uapi_pin_set_mode(CONFIG_UART2_TXD_PIN, 2);
    uapi_pin_set_mode(CONFIG_UART2_RXD_PIN, 2);
}

static void app_uart_init_config(void)
{
    uart_attr_t attr = {
        .baud_rate = UART_BAUDRATE,
        .data_bits = 3,
        .stop_bits = 1,
        .parity = 0
    };

    uart_pin_config_t pin_config = {
        .tx_pin = S_MGPIO8,
        .rx_pin = S_MGPIO7,
        .cts_pin = PIN_NONE,
        .rts_pin = PIN_NONE
    };

    uapi_uart_deinit(CONFIG_UART_BUS_ID); 
    uapi_uart_init(CONFIG_UART_BUS_ID, &pin_config, &attr, NULL, &g_app_uart_buffer_config);

}

void lock_init()
{
     app_uart_init_pin();
    // uapi_watchdog_disable();
    /* UART init config. */
    
    app_uart_init_config();

    uapi_gpio_init();
    uapi_pin_set_mode(LOCK_LEFT_PORT  , HAL_PIO_FUNC_GPIO);
    uapi_gpio_set_dir(LOCK_LEFT_PORT, GPIO_DIRECTION_INPUT);

    uapi_pin_set_mode(LOCK_RIGHT_PORT  , HAL_PIO_FUNC_GPIO);
    uapi_gpio_set_dir(LOCK_RIGHT_PORT, GPIO_DIRECTION_INPUT);

}

void lock_control(int index,int cmd)
{


    uint8_t buffer[4]={0xa0,(uint8_t)index,(uint8_t)cmd,0};
    buffer[3]=(buffer[0]+buffer[1]+buffer[2])&0xff;
    osal_printk("uart write %02x %02x %02x %02x \r\n", 
        buffer[0],buffer[1],buffer[2],buffer[3]);
    uapi_uart_write(CONFIG_UART_BUS_ID, buffer, sizeof(buffer), 0);
}

void open_lock(int index){
    lock_control(index,1);
    osal_msleep(1000);
    lock_control(index,0);
}

int get_lock_state(int index){
  

    return (uapi_gpio_get_val(index)==0) ? LOCKED :UNLOCK;
}