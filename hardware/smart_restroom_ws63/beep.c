#include "beep.h"
#include "pinctrl.h"
#include "pwm.h"
#include "tcxo.h"
#include "soc_osal.h"

#define BEEP_PORT 9
#define BEEP_PWM_CHANNEL 1
#define PWM_GROUP_ID 1

uint8_t Victory_Music[] = {0x33,0x66,0x99}; 
uint8_t GameOver_Music[] = {0xbb,0x26,0x66};
uint8_t Jump_Music[] = {0x36};

static pwm_config_t pwm_cfg = {10000,
                                  20000, // 高电平持续tick 时间 = tick * (1/32000000)
                                  0,     // 相位偏移位
                                  1,     // 发多少个波形
                                  true}; // 是否循环
void beep_init()
{
    // pwm_config_t cfg_no_repeat = {20000, 10000, 0xFF, 0xFF, false};
    uapi_pin_set_mode(BEEP_PORT, PIN_MODE_1);

    uapi_pwm_init();
     uint8_t channel_id = BEEP_PWM_CHANNEL;
    uapi_pwm_set_group(PWM_GROUP_ID, &channel_id, 1); // 每个通道对应一个bit位
    
    uapi_pwm_open(BEEP_PWM_CHANNEL, &pwm_cfg);
 
}

void beep_set_freq(uint16_t freq){
    pwm_cfg.cycles = freq*100;
    uapi_pwm_open(BEEP_PWM_CHANNEL, &pwm_cfg);
}
void beep_set_duty(uint8_t duty){
    pwm_cfg.high_time = (uint32_t)((float)duty / 100 * pwm_cfg.cycles);
    uapi_pwm_open(BEEP_PWM_CHANNEL, &pwm_cfg);
}

void beep_on()
{
    
    printf("beep on\n");
    uapi_pwm_start(BEEP_PWM_CHANNEL);
}
void beep_off()
{
    uapi_pwm_close(BEEP_PWM_CHANNEL);
}

void beep_music(uint8_t *music,uint8_t num){
    for(int i=0;i<num;i++){
        beep_set_freq(music[i]);
        beep_on();
        osal_msleep(200);
    }
    beep_off();
}
