import pandas as pd
import random
from datetime import datetime, timedelta

# 参数设置
NUM_TOILETS = 3          # 厕所数量
STALLS_PER_TOILET = 5    # 每个厕所的厕位数量
NUM_RECORDS = 1000        # 生成的记录数量

def generate_random_data(num_toilets, stalls_per_toilet, num_records):
    data = []
    start_date = datetime(2024, 1, 1, 8, 0, 0) # 从早上 8 点开始
    end_date = datetime(2024, 1, 1, 22, 0, 0)   # 到晚上 10 点结束
    time_range = end_date - start_date
    
    for _ in range(num_records):
        toilet_id = random.randint(1, num_toilets)
        stall_id = random.randint(1, stalls_per_toilet)
        gender = random.choice(['Male', 'Female'])
        
        # 随机生成开始时间
        random_seconds = random.randint(0, int(time_range.total_seconds()))
        start_time = start_date + timedelta(seconds=random_seconds)
        
        # 随机生成使用时长 (1-10 分钟)
        duration = random.randint(1, 10)
        end_time = start_time + timedelta(minutes=duration)
        
        data.append({
            'toilet_id': toilet_id,
            'stall_id': stall_id,
            'gender': gender,
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S'),
            'duration': duration,
            'toilet_status': 'Unknown' # 初始状态为Unknown
        })

    df = pd.DataFrame(data)
    
    # 计算厕所状态
    df['start_time'] = pd.to_datetime(df['start_time']) # 将时间列转换为 datetime 类型
    df['end_time'] = pd.to_datetime(df['end_time'])
    df = calculate_toilet_status(df, num_toilets, start_date, end_date)
    
    return df

def calculate_toilet_status(df, num_toilets, start_date, end_date):
    for toilet_id in range(1, num_toilets + 1):
        #  获取当前厕所所有记录
        toilet_data = df[df['toilet_id'] == toilet_id]

        #  每 15 分钟间隔遍历时间线
        current_time = start_date
        while current_time <= end_date:
            end_interval = current_time + timedelta(minutes=15)
            # 计算当前时间间隔内，当前厕所的使用数量
            count = ((toilet_data['start_time'] < end_interval) & (toilet_data['end_time'] > current_time)).sum()
            
            for index, row in df.iterrows():
               if row['toilet_id'] == toilet_id and row['start_time'] < end_interval and row['end_time'] > current_time:
                   # 根据使用数量更新状态
                   if count <= 1:
                        df.at[index, 'toilet_status'] = 'Idle'  # 空闲
                   elif count <= 3:
                        df.at[index, 'toilet_status'] = 'Normal'  # 正常
                   else:
                         df.at[index, 'toilet_status'] = 'Crowded'  # 拥挤
            current_time = end_interval
    return df


if __name__ == "__main__":
    df = generate_random_data(NUM_TOILETS, STALLS_PER_TOILET, NUM_RECORDS)
    df.to_csv('toilet_data.csv', index=False)
    print("随机数据已生成并保存到 toilet_data.csv 文件中.")