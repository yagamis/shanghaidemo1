#ifndef __OLEDFONT_H
#define __OLEDFONT_H 	   
//常用ASCII表
//偏移量32
//ASCII字符集
//偏移量32
//大小:6*8
//逐行式，顺向（高位在前）
/************************************6*8的点阵************************************/
extern const unsigned char F6x8[][8]; 
//常用ASCII表
//偏移量32
//ASCII字符集
//偏移量32
//大小:8*16
//逐行式，顺向（高位在前）
/****************************************8*16的点阵************************************/
extern const unsigned char F8X16[];

typedef struct 
{
	unsigned char Index[3];	
	char Msk[32];
}typFNT_GB16; 

//宋体
//16*16大小
//逐行式，顺向（高位在前）

extern const typFNT_GB16 cfont16[18]; 
typedef struct 
{
	unsigned char Index[2];	
	char Msk[72];
}typFNT_GB24; 

//宋体
//24*24大小
//逐行式，顺向（高位在前）
extern const typFNT_GB24 cfont24[0];
typedef struct 
{
       unsigned char Index[2];	
       char Msk[128];
}typFNT_GB32; 

//宋体
//32*32大小
//逐行式，顺向（高位在前）
extern const typFNT_GB32 cfont32[0];
#endif
