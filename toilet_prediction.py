import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.metrics import accuracy_score, mean_squared_error
from datetime import datetime

def preprocess_data(df):
    # 1.  数据预处理
    df['start_time'] = pd.to_datetime(df['start_time'])
    df['end_time'] = pd.to_datetime(df['end_time'])
    
    # 2. 特征工程
    df['hour'] = df['start_time'].dt.hour
    df['day_of_week'] = df['start_time'].dt.dayofweek  # 0=周一, 6=周日

    # 3. 将厕所状态编码
    status_mapping = {'Idle': 0, 'Normal': 1, 'Crowded': 2}
    df['toilet_status_encoded'] = df['toilet_status'].map(status_mapping)

    return df

def train_models(df):
    # 1.  准备特征和目标变量
    features = ['hour', 'day_of_week', 'toilet_id']
    status_target = 'toilet_status_encoded'
    
    # 2. 分割训练集和测试集
    X_train, X_test, y_train, y_test = train_test_split(df[features], df[status_target], test_size=0.2, random_state=42)
    
    # 3. 训练状态预测模型
    status_model = RandomForestClassifier(random_state=42)
    status_model.fit(X_train, y_train)
    
    # 4. 预测状态并评估
    y_pred = status_model.predict(X_test)
    status_accuracy = accuracy_score(y_test, y_pred)
    print(f"状态预测模型准确率：{status_accuracy:.2f}")
    
    
    # 计算每个时间点的使用人数，以小时为单位，并加入统计数据，这里我们选取每小时的平均值
    hourly_counts = df.groupby(['toilet_id', 'hour', 'day_of_week'])['duration'].count().reset_index()
    hourly_counts.rename(columns={'duration': 'usage_count'}, inplace=True)
    
    usage_features = ['hour', 'day_of_week', 'toilet_id']
    usage_target = 'usage_count'
    
    X_usage = hourly_counts[usage_features]
    y_usage = hourly_counts[usage_target]

    X_usage_train, X_usage_test, y_usage_train, y_usage_test = train_test_split(X_usage, y_usage, test_size=0.2, random_state=42)

    # 训练人数预测模型
    usage_model = LinearRegression()
    usage_model.fit(X_usage_train, y_usage_train)

    y_usage_pred = usage_model.predict(X_usage_test)
    usage_mse = mean_squared_error(y_usage_test, y_usage_pred)
    print(f"人数预测模型均方误差：{usage_mse:.2f}")

    return status_model, usage_model

def predict_toilet_status_usage(status_model, usage_model, hour, day_of_week, toilet_id):
    # 创建特征向量
    input_data = pd.DataFrame({
        'hour': [hour],
        'day_of_week': [day_of_week],
        'toilet_id': [toilet_id]
    })

    # 预测状态
    predicted_status_encoded = status_model.predict(input_data)[0]
    status_mapping = {0: 'Idle', 1: 'Normal', 2: 'Crowded'}
    predicted_status = status_mapping.get(predicted_status_encoded, 'Unknown')
    
    # 预测人数
    predicted_usage_count = usage_model.predict(input_data)[0]

    return predicted_status, int(round(predicted_usage_count))

import matplotlib.pyplot as plt
import seaborn as sns

def visualize_usage(df):
    # 计算每个时间点的使用人数，以小时为单位，并加入统计数据，这里我们选取每小时的平均值
    hourly_counts = df.groupby(['toilet_id', 'hour', 'day_of_week'])['duration'].count().reset_index()
    hourly_counts.rename(columns={'duration': 'usage_count'}, inplace=True)

    # 使用seaborn进行可视化
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=hourly_counts, x='hour', y='usage_count', hue='toilet_id', palette='Set1')
    plt.title('每个厕所的使用人数随时间的变化')
    plt.xlabel('时间（小时）')
    plt.ylabel('使用人数')
    plt.legend(title='厕所ID')
    plt.show()

if __name__ == "__main__":
    # 1. 加载数据
    df = pd.read_csv('toilet_data.csv', encoding='utf-8')

    # 2. 预处理数据
    df = preprocess_data(df)

    # 3. 训练模型
    status_model, usage_model = train_models(df)

    # 4. 使用模型进行预测
    current_hour = 10
    current_day_of_week = 0  # 星期一
    toilet_id = 1

    predicted_status, predicted_usage_count = predict_toilet_status_usage(status_model, usage_model, current_hour, current_day_of_week, toilet_id)

    print(f"预测时： {current_hour}点， 星期{current_day_of_week}, 厕所ID为： {toilet_id} 的状态是：{predicted_status}， 使用人数： {predicted_usage_count}")

    # 5. 可视化数据
    visualize_usage(df)