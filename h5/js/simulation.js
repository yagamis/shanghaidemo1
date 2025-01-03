// 模拟配置
const SIMULATION_CONFIG = {
    DAY_DURATION: 1440, // 1440毫秒代表一天（1440分钟）
    MALE_DURATION: 2,    // 男性如厕时间2分钟
    FEMALE_DURATION: 6,  // 女性如厕时间6分钟
    FEMALE_WAIT_LIMIT: 20, // 女性最大等待时间20分钟
    // 跨年活动特殊配置
    NEW_YEAR_EVENT: {
        enabled: false,  // 是否开启跨年模式
        visitorMultiplier: 7.5,  // 游客量倍数（根据西湖跨年活动历史数据预估）
        durationMultiplier: 2.5,  // 如厕时间延长倍数（考虑拥挤、寒冷天气等因素）
        timeRange: {
            start: 1080,  // 18:00开始
            end: 150,     // 次日凌晨2:30结束（跨天）
        },
        peakHours: [
            { start: 22.5, end: 24, ratio: 4.0 },  // 跨年倒计时高峰 22:30-24:00
            { start: 0, end: 0.5, ratio: 5.0 }     // 跨年后高峰 00:00-00:30
        ],
        specialSuggestions: [
            "在重点区域设置LED大屏实时显示各公厕排队情况",
            "设置移动支付快速通道，鼓励使用小程序预约系统",
            "在公厕周边设置暖气设施和休息区，提供热饮服务",
            "组建志愿者团队，帮助引导和维持秩序",
            "与周边商家合作延长营业时间，开放卫生间使用",
            "设置老年人、孕妇等特殊人群绿色通道",
            "在公厕周边设置临时医疗点，以防不适",
            "提供免费暖贴和一次性暖手宝服务",
            "增设临时照明设施，确保夜间安全",
            "配备应急发电机，防止供电问题"
        ]
    },
    PEAK_HOURS: [ // 高峰时段配置（24小时制）
        { start: 9, end: 11, ratio: 2.5 },  // 上午高峰
        { start: 14, end: 16, ratio: 2.0 }, // 下午高峰
        { start: 19, end: 21, ratio: 1.8 }  // 晚间高峰
    ],
    // 西湖景区日均游客流量（根据2023年统计数据）
    DAILY_VISITORS: {
        WEEKDAY: 50000,  // 工作日平均
        WEEKEND: 100000, // 周末平均
        HOLIDAY: 150000  // 节假日平均
    },
    // 不同区域的游客分布比例
    AREA_DISTRIBUTION: {
        '西湖公园公厕': 0.3,    // 核心景区
        '断桥公厕': 0.25,      // 热门景点
        '雷峰塔公厕': 0.2,     // 重要景点
        '苏堤公厕': 0.15,      // 一般景点
        '其他公厕': 0.1        // 其他区域
    },
    // 如厕需求比例（每人平均每天使用厕所的次数）
    TOILET_USAGE_RATIO: 0.4
};

// 批量处理的记录数
const BATCH_SIZE = 100;

// 模拟结果管理器
const SimulationManager = {
    results: null,  // 当前模拟结果
    isSimulating: false,  // 模拟状态
    
    // 内存中的临时数据
    memoryData: {
        toilets: [],      // 厕所数据副本
        records: [],      // 使用记录
        stats: {          // 统计数据
            male: { total: 0, failed: 0 },
            female: { total: 0, failed: 0 },
            toilets: {}
        }
    },
    
    // 初始化模拟
    async init() {
        // 清理旧的模拟历史
        try {
            localStorage.removeItem('simulationHistory');
        } catch (e) {
            console.warn('Failed to clear simulation history:', e);
        }

        // 从localStorage获取厕所数据的副本
        const toiletsData = JSON.parse(localStorage.getItem('toiletsData') || '[]');
        this.memoryData.toilets = JSON.parse(JSON.stringify(toiletsData));
        this.memoryData.records = [];
        this.resetStats();
    },
    
    // 重置统计数据
    resetStats() {
        this.memoryData.stats = {
            male: { total: 0, failed: 0 },
            female: { total: 0, failed: 0 },
            toilets: {}
        };
    },
    
    // 保存模拟结果
    saveResults() {
        const results = {
            timestamp: Date.now(),
            stats: this.memoryData.stats,
            config: { ...SIMULATION_CONFIG }
        };
        
        // 只保存最新的模拟结果
        try {
            localStorage.setItem('simulationHistory', JSON.stringify([results]));
        } catch (e) {
            console.warn('Failed to save simulation history:', e);
            // 如果存储失败，尝试只保存关键数据
            const simplifiedResults = {
                timestamp: results.timestamp,
                stats: {
                    male: results.stats.male,
                    female: results.stats.female,
                    toilets: Object.fromEntries(
                        Object.entries(results.stats.toilets).map(([name, data]) => [
                            name,
                            {
                                male: data.male,
                                female: data.female,
                                stalls: {
                                    male: data.male.stalls,
                                    female: data.female.stalls
                                }
                            }
                        ])
                    )
                }
            };
            localStorage.setItem('simulationHistory', JSON.stringify([simplifiedResults]));
        }
        
        return results;
    }
};

// 模拟状态
let simulationStats = {
    male: { total: 0, failed: 0 },
    female: { total: 0, failed: 0 },
    toilets: {} // 按厕所存储统计数据
};

// 用于批量存储的缓存
let recordsCache = {};

// 获取某个时间点的流量倍率
function getTimeRatio(time) {
    const hour = new Date(time).getHours();
    const minutes = new Date(time).getMinutes();
    const hourDecimal = hour + minutes / 60;
    
    // 如果是跨年模式且在活动时间范围内
    if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
        // 检查是否在跨年高峰时段
        for (const peak of SIMULATION_CONFIG.NEW_YEAR_EVENT.peakHours) {
            if ((peak.start <= hourDecimal && hourDecimal < 24) || 
                (0 <= hourDecimal && hourDecimal < peak.end)) {
                return peak.ratio;
            }
        }
    }
    
    const peak = SIMULATION_CONFIG.PEAK_HOURS.find(p => hour >= p.start && hour < p.end);
    return peak ? peak.ratio : 1;
}

// 获取预估游客流量
function estimateVisitorFlow(toiletName) {
    // 判断当前是否周末
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    // 获取基础日流量
    let baseFlow = isWeekend ? 
        SIMULATION_CONFIG.DAILY_VISITORS.WEEKEND : 
        SIMULATION_CONFIG.DAILY_VISITORS.WEEKDAY;
    
    // 如果是跨年模式，增加游客量
    if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
        baseFlow *= SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier;
    }
    
    // 获取该厕所的区域分布比例
    const areaRatio = SIMULATION_CONFIG.AREA_DISTRIBUTION[toiletName] || 
        SIMULATION_CONFIG.AREA_DISTRIBUTION['其他公厕'];
    
    // 计算该厕所的预计使用人数
    const estimatedUsers = Math.round(
        baseFlow * 
        areaRatio * 
        SIMULATION_CONFIG.TOILET_USAGE_RATIO
    );
    
    return estimatedUsers;
}

// 模拟单个厕所的使用
async function simulateToilet(toilet, startTime) {
    // 从内存中获取临时厕所数据
    const toiletsData = SimulationManager.memoryData.toilets;
    const temporaryToilets = toiletsData.filter(t => 
        t.isTemporary && t.parentToilet === toilet.name
    );

    // 初始化该厕所的统计数据
    SimulationManager.memoryData.stats.toilets[toilet.name] = {
        male: { total: 0, failed: 0, stalls: 0 },
        female: { total: 0, failed: 0, stalls: 0 },
        records: []
    };

    // 合并主厕所和临时厕所的厕位状态
    const stallsStatus = [
        // 主厕所的厕位
        ...toilet.stalls.map(stall => ({
            gender: stall.gender,
            busy: false,
            busyUntil: 0,
            isTemporary: false
        })),
        // 临时厕所的厕位
        ...temporaryToilets.flatMap(tempToilet => 
            tempToilet.stalls.map(stall => ({
                gender: stall.gender,
                busy: false,
                busyUntil: 0,
                isTemporary: true,
                toiletName: tempToilet.name
            }))
        )
    ];

    // 统计男女厕位数量
    stallsStatus.forEach(stall => {
        if (stall.gender === '男') {
            SimulationManager.memoryData.stats.toilets[toilet.name].male.stalls++;
        } else if (stall.gender === '女') {
            SimulationManager.memoryData.stats.toilets[toilet.name].female.stalls++;
        }
    });

    // 计算每个性别的到达间隔
    const maleInterval = SIMULATION_CONFIG.DAY_DURATION / SIMULATION_CONFIG.USERS_PER_DAY;
    const femaleInterval = maleInterval;

    // 生成用户到达时间
    const maleArrivals = generateArrivals('男', maleInterval, startTime, toilet.name);
    const femaleArrivals = generateArrivals('女', femaleInterval, startTime, toilet.name);
    const allArrivals = [...maleArrivals, ...femaleArrivals].sort((a, b) => a.time - b.time);

    // 初始化该厕所的缓存
    recordsCache[toilet.name] = [];

    // 处理每个用户
    for (const user of allArrivals) {
        const availableStalls = stallsStatus.filter(s => 
            s.gender === user.gender && 
            s.busyUntil <= user.time
        );

        if (availableStalls.length > 0) {
            // 找到空闲厕位
            const stall = availableStalls[0];
            let duration = user.gender === '男' ? 
                SIMULATION_CONFIG.MALE_DURATION : 
                SIMULATION_CONFIG.FEMALE_DURATION;
            
            // 如果是跨年模式，延长如厕时间
            if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
                duration *= SIMULATION_CONFIG.NEW_YEAR_EVENT.durationMultiplier;
            }
            
            stall.busy = true;
            stall.busyUntil = user.time + duration;

            // 记录使用
            SimulationManager.memoryData.stats.toilets[toilet.name].records.push({
                gender: user.gender,
                time: user.time,
                failed: false,
                isPeakHour: user.isPeakHour,
                isTemporary: stall.isTemporary,
                temporaryToiletName: stall.toiletName
            });

            recordsCache[toilet.name].push({
                stallId: stallsStatus.indexOf(stall) + 1,
                gender: user.gender,
                time: user.time,
                isTemporary: stall.isTemporary,
                temporaryToiletName: stall.toiletName
            });

            // 当缓存达到一定大小时批量保存
            if (SimulationManager.memoryData.records.length >= BATCH_SIZE) {
                // 仅在内存中累积记录，不写入存储
                SimulationManager.memoryData.records = [];
            }
        } else {
            // 没有空闲厕位
            if (user.gender === '女') {
                // 女性等待逻辑
                const minWaitTime = Math.min(...stallsStatus
                    .filter(s => s.gender === '女')
                    .map(s => s.busyUntil - user.time));
                
                if (minWaitTime > SIMULATION_CONFIG.FEMALE_WAIT_LIMIT) {
                    SimulationManager.memoryData.stats.female.failed++;
                    SimulationManager.memoryData.stats.toilets[toilet.name].female.failed++;
                }
            }
            SimulationManager.memoryData.stats[user.gender === '男' ? 'male' : 'female'].failed++;
            SimulationManager.memoryData.stats.toilets[toilet.name][user.gender === '男' ? 'male' : 'female'].failed++;
            // 记录失败的尝试
            SimulationManager.memoryData.stats.toilets[toilet.name].records.push({
                gender: user.gender,
                time: user.time,
                failed: true,
                isPeakHour: user.isPeakHour
            });
        }
    }

    // 保存剩余的记录
    if (recordsCache[toilet.name].length > 0) {
        // 仅在内存中累积记录，不写入存储
        SimulationManager.memoryData.records = [];
    }
}

// 生成用户到达时间
function generateArrivals(gender, interval, startTime, toiletName) {
    const arrivals = [];
    const toilet = SimulationManager.memoryData.toilets
        .find(t => t.name === toiletName);
    
    // 计算24小时的总权重
    const totalWeight = Array.from({length: 24}, (_, hour) => {
        const peak = SIMULATION_CONFIG.PEAK_HOURS.find(p => hour >= p.start && hour < p.end);
        return peak ? peak.ratio : 1;
    }).reduce((sum, ratio) => sum + ratio, 0);
    
    // 计算该性别的总用户数
    const totalUsers = Math.round(toilet.usersPerDay * (gender === '男' ? 0.45 : 0.55)); // 男女比例调整为45:55
    let remainingUsers = totalUsers;
    
    // 按小时生成用户
    for (let hour = 0; hour < 24; hour++) {
        const hourStart = new Date(startTime);
        hourStart.setHours(hour, 0, 0, 0);
        const hourDuration = SIMULATION_CONFIG.DAY_DURATION / 24;
        
        // 计算这个小时的用户数
        const ratio = getTimeRatio(hourStart);
        const hourUsers = Math.round((totalUsers / 24) * ratio); // 更准确的小时用户分配
        
        // 在这个小时内随机生成用户到达时间
        for (let i = 0; i < hourUsers && remainingUsers > 0; i++) {
            arrivals.push({
                gender,
                time: hourStart.getTime() + Math.random() * hourDuration,
                isPeakHour: ratio > 1
            });
            remainingUsers--;
            SimulationManager.memoryData.stats[gender === '男' ? 'male' : 'female'].total++;
            SimulationManager.memoryData.stats.toilets[toiletName][gender === '男' ? 'male' : 'female'].total++;
        }
    }
    return arrivals.sort((a, b) => a.time - b.time);
}

// 批量保存记录
async function batchSaveRecords(toiletName) {
    const stats = JSON.parse(localStorage.getItem('unlockStats') || '{}');
    if (!stats[toiletName]) {
        stats[toiletName] = [];
    }
    
    stats[toiletName] = stats[toiletName].concat(recordsCache[toiletName]);
    
    localStorage.setItem('unlockStats', JSON.stringify(stats));
    recordsCache[toiletName] = [];

    // 给浏览器一些时间处理其他任务
    await new Promise(resolve => setTimeout(resolve, 0));
}

// 开始模拟
async function startSimulation() {
    if (SimulationManager.isSimulating) {
        showToast('模拟正在进行中，请稍候', 'info');
        return;
    }

    try {
        SimulationManager.isSimulating = true;
        
        // 禁用开始按钮
        const startBtn = document.querySelector('.simulate-btn');
        startBtn.disabled = true;
        startBtn.style.opacity = '0.7';

        // 初始化模拟环境
        await SimulationManager.init();

        // 获取所有厕所数据
        const toiletsData = SimulationManager.memoryData.toilets;

        // 计算每个厕所的预计使用人数
        toiletsData.forEach(toilet => {
            const visitorCount = estimateVisitorFlow(toilet.name);
            toilet.usersPerDay = visitorCount;
            console.log(`${toilet.name} 预计用户数: ${visitorCount}`);
        });

        // 设置模拟开始时间
        const startTime = new Date().setHours(0, 0, 0, 0);

        // 并行模拟所有厕所
        await Promise.all(toiletsData.map(toilet => 
            simulateToilet(toilet, startTime)
        ));

        // 保存模拟结果
        const results = SimulationManager.saveResults();

        // 显示模拟结果
        showSimulationResults(results.stats);

    } catch (error) {
        console.error('Simulation failed:', error);
        showToast('模拟执行失败，请重试', 'error');
    } finally {
        // 恢复开始按钮状态
        const startBtn = document.querySelector('.simulate-btn');
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        SimulationManager.isSimulating = false;
    }
}

// 附近可用设施数据
const NEARBY_FACILITIES = {
    '西湖公园公厕': [
        { name: '湖滨银泰', distance: '300m', type: 'mall' },
        { name: '星巴克(平海路店)', distance: '150m', type: 'restaurant' }
    ],
    '断桥公厕': [
        { name: '外婆家(白堤店)', distance: '200m', type: 'restaurant' },
        { name: '新白鹿(断桥店)', distance: '180m', type: 'restaurant' }
    ],
    '雷峰塔公厕': [
        { name: '杭州海底捞(南山路店)', distance: '400m', type: 'restaurant' },
        { name: '南山商业中心', distance: '500m', type: 'mall' }
    ],
    '苏堤公厕': [
        { name: '花港海鲜酒楼', distance: '300m', type: 'restaurant' },
        { name: '苏堤春晓商业街', distance: '250m', type: 'mall' }
    ]
};

// 可建设临时厕所的位置数据
const TEMPORARY_LOCATIONS = {
    '西湖公园公厕': [
        { 
            name: '花港观鱼停车场旁',
            location: '距离西湖公园公厕200米',
            space: '空地面积约150平方米',
            recommended: {
                female: 16,
                male: 8
            }
        },
        {
            name: '断桥西侧绿地',
            location: '距离西湖公园公厕300米',
            space: '空地面积约120平方米',
            recommended: {
                female: 12,
                male: 4
            }
        }
    ],
    '断桥公厕': [
        {
            name: '白堤入口广场',
            location: '距离断桥公厕150米',
            space: '空地面积约200平方米',
            recommended: {
                female: 20,
                male: 8
            }
        }
    ],
    '雷峰塔公厕': [
        {
            name: '雷峰塔停车场东侧',
            location: '距离雷峰塔公厕250米',
            space: '空地面积约180平方米',
            recommended: {
                female: 16,
                male: 6
            }
        }
    ],
    '苏堤公厕': [
        {
            name: '苏堤春晓景区入口',
            location: '距离苏堤公厕200米',
            space: '空地面积约160平方米',
            recommended: {
                female: 14,
                male: 6
            }
        }
    ]
};

// 计算优化建议
function calculateOptimizations(stats) {
    const suggestions = [];
    
    Object.entries(stats.toilets).forEach(([toiletName, toiletStats]) => {
        // 获取所有相关的临时厕所
        const toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
        const relatedTemporaryToilets = toiletsData.filter(t => 
            t.isTemporary && t.parentToilet === toiletName
        );

        // 计算包含临时厕所在内的总厕位数
        const totalStalls = {
            male: toiletStats.male.stalls + 
                relatedTemporaryToilets.reduce((sum, t) => 
                    sum + t.stalls.filter(s => s.gender === '男').length, 0),
            female: toiletStats.female.stalls + 
                relatedTemporaryToilets.reduce((sum, t) => 
                    sum + t.stalls.filter(s => s.gender === '女').length, 0)
        };

        const maleStalls = toiletStats.male.stalls;
        const femaleStalls = toiletStats.female.stalls;
        
        // 计算男女使用情况
        const femaleFailRate = toiletStats.female.total > 0 ? 
            toiletStats.female.failed / toiletStats.female.total : 0;
        const maleFailRate = toiletStats.male.total > 0 ? 
            toiletStats.male.failed / toiletStats.male.total : 0;
        
        // 计算男女使用压力
        const femalePressure = toiletStats.female.total * SIMULATION_CONFIG.FEMALE_DURATION;
        const malePressure = toiletStats.male.total * SIMULATION_CONFIG.MALE_DURATION;
        
        // 计算理想的男女厕位比例
        const totalPressure = femalePressure + malePressure;
        const idealFemaleRatio = femalePressure / totalPressure;
        const idealMaleRatio = malePressure / totalPressure;
        
        // 计算男女厕位使用效率
        const femaleStallUsage = toiletStats.female.total / totalStalls.female;
        const maleStallUsage = toiletStats.male.total / totalStalls.male;

        let suggestion = {
            toiletName,
            needsOptimization: false,
            convertCount: 0,
            peakHourNeeds: 0,
            longTermPlan: {
                female: 0,
                male: 0
            },
            alternativeSuggestions: []
        };
        
        // 如果女性失败率超过10%，考虑优化
        if (femaleFailRate > 0.1) {
            // 计算需要转换的男厕位数量
            // 1. 首先计算理想的女厕位数量
            const idealFemaleStalls = Math.ceil(
                (toiletStats.female.total * SIMULATION_CONFIG.FEMALE_DURATION) /
                SIMULATION_CONFIG.DAY_DURATION * 1.2  // 增加20%缓冲
            );

            // 2. 计算可以转换的男厕位数量
            // 确保男厕位使用率不会因转换而超过80%
            const maxConvertibleMaleStalls = Math.floor(
                maleStalls - (toiletStats.male.total * SIMULATION_CONFIG.MALE_DURATION) /
                (SIMULATION_CONFIG.DAY_DURATION * 0.8)  // 保持80%利用率
            );

            // 3. 计算建议转换的数量
            suggestion.convertCount = Math.min(
                maxConvertibleMaleStalls,
                idealFemaleStalls - totalStalls.female
            );

            // 如果建议数量为负数或0，则不建议转换
            suggestion.convertCount = Math.max(0, suggestion.convertCount);

            // 对于高峰时段的特殊建议
            if (suggestion.convertCount === 0 && femaleFailRate > 0.2) {
                suggestion.peakHourNeeds = Math.ceil(
                    (toiletStats.female.failed * SIMULATION_CONFIG.FEMALE_DURATION) /
                    (SIMULATION_CONFIG.DAY_DURATION / 24)  // 按小时计算
                );
            }

            // 计算长期规划建议
            // 考虑高峰时段的需求，计算理想的厕位数量
            const peakHourFactor = Math.max(...SIMULATION_CONFIG.PEAK_HOURS.map(p => p.ratio));
            const idealCapacity = {
                female: Math.ceil(
                    (toiletStats.female.total * SIMULATION_CONFIG.FEMALE_DURATION * peakHourFactor) /
                    (SIMULATION_CONFIG.DAY_DURATION * 0.7)  // 控制使用率在70%以下
                ),
                male: Math.ceil(
                    (toiletStats.male.total * SIMULATION_CONFIG.MALE_DURATION * peakHourFactor) /
                    (SIMULATION_CONFIG.DAY_DURATION * 0.7)
                )
            };

            // 计算需要新增的厕位数量
            suggestion.longTermPlan = {
                female: Math.max(0, idealCapacity.female - femaleStalls),
                male: Math.max(0, idealCapacity.male - maleStalls)
            };

            // 检查是否需要临时厕所或引流方案
            if (suggestion.longTermPlan.female > totalStalls.female) {
                // 计算需要增加的总厕位数
                const totalNewStalls = suggestion.longTermPlan.female + suggestion.longTermPlan.male;
                const currentTotalStalls = totalStalls.female + totalStalls.male;
                
                if (totalNewStalls > currentTotalStalls * 1.5) {
                    const availableLocations = TEMPORARY_LOCATIONS[toiletName] || [];
                    const unusedLocations = availableLocations.filter(loc => 
                        !relatedTemporaryToilets.some(t => t.name === loc.name)
                    );
                    
                    if (unusedLocations.length > 0) {
                        suggestion.alternativeSuggestions.push({
                            type: 'new_toilet',
                            message: '建议新建临时公厕：',
                            locations: unusedLocations.map(loc => {
                                // 根据使用压力计算男女厕位数量
                                const totalStalls = loc.recommended.female + loc.recommended.male;
                                // 确保男厕位至少占20%
                                let recommendedMale = Math.max(
                                    Math.ceil(totalStalls * 0.2),  // 至少20%
                                    Math.round(totalStalls * idealMaleRatio)  // 或根据压力计算
                                );
                                let recommendedFemale = totalStalls - recommendedMale;
                                
                                // 如果女厕位比例过低，适当调整总数
                                if (recommendedFemale / totalStalls < 0.6) {
                                    const newTotal = Math.ceil(recommendedMale / 0.3);  // 确保男厕位不超过30%
                                    recommendedFemale = newTotal - recommendedMale;
                                }
                                
                                return {
                                    ...loc,
                                    recommended: {
                                        female: recommendedFemale,
                                        male: recommendedMale
                                    }
                                };
                            })
                        });
                    }
                } else {
                    // 如果需要增加的女厕位超过现有数量但未超过1.5倍
                    suggestion.alternativeSuggestions.push({
                        type: 'temporary',
                        count: Math.ceil(suggestion.longTermPlan.female / 2),
                        message: `建议在景区适当位置增设${Math.ceil(suggestion.longTermPlan.female / 2)}个临时女厕位`
                    });
                }

                // 添加附近设施引流建议
                const nearbyFacilities = NEARBY_FACILITIES[toiletName] || [];
                if (nearbyFacilities.length > 0) {
                    suggestion.alternativeSuggestions.push({
                        type: 'diversion',
                        facilities: nearbyFacilities,
                        message: '建议通过标识牌引导游客前往以下临近设施：'
                    });
                }
            }

            // 如果需要增加厕位，则标记需要优化
            if (suggestion.longTermPlan.female > 0 || suggestion.longTermPlan.male > 0) {
                suggestion.needsOptimization = true;
            }
        }
        
        suggestion.needsOptimization = suggestion.convertCount > 0 || 
            suggestion.peakHourNeeds > 0 || 
            suggestion.longTermPlan.female > 0 || 
            suggestion.longTermPlan.male > 0;
        
        if (suggestion.needsOptimization) {
            // 如果是跨年模式，添加特殊建议
            if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
                const newYearSuggestion = {
                    type: 'new_year_special',
                    message: '跨年活动特别建议：',
                    recommendations: SIMULATION_CONFIG.NEW_YEAR_EVENT.specialSuggestions
                };
                
                // 确保 alternativeSuggestions 存在
                if (!suggestion.alternativeSuggestions) {
                    suggestion.alternativeSuggestions = [];
                }
                
                suggestion.alternativeSuggestions.push(newYearSuggestion);
            }
            
            suggestions.push(suggestion);
        }
    });
    
    return suggestions;
}

// 显示模拟结果
function showSimulationResults(stats) {
    const maleFailRate = Math.round(stats.male.failed / stats.male.total * 100);
    const femaleFailRate = Math.round(stats.female.failed / stats.female.total * 100);

    // 更新总体结果显示
    document.getElementById('totalMaleFailRate').textContent = 
        `${stats.male.failed}/${stats.male.total} (${maleFailRate}%)`;
    document.getElementById('totalFemaleFailRate').textContent = 
        `${stats.female.failed}/${stats.female.total} (${femaleFailRate}%)`;

    // 如果是跨年模式，显示特别建议
    if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
        const specialSuggestionsHtml = `
            <div class="new-year-suggestions">
                <h4>🎆 跨年活动特别建议</h4>
                <div class="suggestions-grid">
                    ${SIMULATION_CONFIG.NEW_YEAR_EVENT.specialSuggestions.map(suggestion => `
                        <div class="suggestion-card">
                            <div class="suggestion-content">
                                <i class="fas fa-lightbulb"></i>
                                <span>${suggestion}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 在厕所建议之前插入跨年特别建议
        const suggestionsContainer = document.getElementById('toiletSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.insertAdjacentHTML('afterbegin', specialSuggestionsHtml);
        }
    }

    // 更新各厕所结果显示
    const toiletStatsHtml = Object.entries(stats.toilets).map(([toiletName, stats]) => {
        // 避免除以0的情况
        const maleRate = stats.male.total > 0 ? 
            Math.round(stats.male.failed / stats.male.total * 100) : 0;
        const femaleRate = stats.female.total > 0 ? 
            Math.round(stats.female.failed / stats.female.total * 100) : 0;
        
        // 获取临时厕所的使用统计
        const temporaryStats = stats.records
            .filter(r => r.isTemporary)
            .reduce((acc, record) => {
                const key = record.temporaryToiletName;
                if (!acc[key]) {
                    acc[key] = { male: 0, female: 0 };
                }
                acc[key][record.gender === '男' ? 'male' : 'female']++;
                return acc;
            }, {});
        
        return `
            <div class="toilet-stat-item">
                <div class="toilet-name">${toiletName}</div>
                <div class="stats-row">
                    <div class="male-stats">
                        <i class="fas fa-male"></i>
                        ${stats.male.failed}/${stats.male.total} (${maleRate}%) - ${stats.male.stalls}个男厕位
                    </div>
                    <div class="female-stats">
                        <i class="fas fa-female"></i>
                        ${stats.female.failed}/${stats.female.total} (${femaleRate}%) - ${stats.female.stalls}个女厕位
                    </div>
                </div>
                ${Object.entries(temporaryStats).length > 0 ? `
                    <div class="temporary-stats">
                        <div class="temporary-stats-header">临时厕所使用情况：</div>
                        ${Object.entries(temporaryStats).map(([name, usage]) => `
                            <div class="temporary-toilet-usage">
                                <div class="temp-toilet-name">${name}</div>
                                <div class="usage-stats">
                                    <span class="male"><i class="fas fa-male"></i> ${usage.male}次</span>
                                    <span class="female"><i class="fas fa-female"></i> ${usage.female}次</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    document.getElementById('toiletSimulationStats').innerHTML = toiletStatsHtml;

    // 计算并显示优化建议
    const suggestions = calculateOptimizations(stats);
    const suggestionsHtml = suggestions.map(suggestion => {
        const toiletName = suggestion.toiletName;
        return `
            <div class="suggestion-item">
                <div class="toilet-name">${suggestion.toiletName}</div>
                <div class="suggestion-content">
                    ${suggestion.alternativeSuggestions.map(alt => {
                        if (alt.type === 'new_year_special') {
                            return `
                                <div class="new-year-special">
                                    <strong>${alt.message}</strong><br>
                                    ${alt.recommendations.map(rec => `• ${rec}`).join('<br>')}
                                </div>
                            `;
                        } else if (alt.type === 'new_toilet') {
                            return `• ${alt.message}
                                <button class="add-toilet-btn" 
                                    id="add-toilet-${toiletName.replace(/\s+/g, '-')}"
                                    onclick='addTemporaryToilets(${JSON.stringify({
                                    parentName: toiletName,
                                    locations: alt.locations
                                })})'>
                                    <i class="fas fa-plus"></i> 添加临时厕所
                                </button><br>
                                ${alt.locations.map(loc => 
                                    `  - ${loc.name}<br>
                                       &nbsp;&nbsp;位置：${loc.location}<br>
                                       &nbsp;&nbsp;场地：${loc.space}<br>
                                       &nbsp;&nbsp;建议配置：${loc.recommended.female}个女厕位、${loc.recommended.male}个男厕位`
                                ).join('<br><br>')}`;
                        }
                        return `• ${alt.message}`;
                    }).join('<br><br>')}
                </div>
            </div>
        `;
    });

    document.getElementById('toiletSuggestions').innerHTML = 
        suggestions.length > 0 ? suggestionsHtml.join('') : '<div class="no-suggestions">当前配置已经较为合理</div>';

    // 显示结果区域
    document.getElementById('simulationResults').style.display = 'block';

    // 添加相应的样式
    const style = document.createElement('style');
    style.textContent = `
        .new-year-suggestions {
            background: #fff8e1;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            border: 1px solid #ffe082;
        }

        .new-year-suggestions h4 {
            color: #f57c00;
            margin: 0 0 16px 0;
            font-size: 16px;
        }

        .suggestions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 12px;
        }

        .suggestion-card {
            background: white;
            border-radius: 6px;
            padding: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .suggestion-content {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            flex-direction:column;
        }

        .suggestion-content i {
            color: #ffa000;
            margin-top: 3px;
        }

        .suggestion-content span {
            font-size: 14px;
            line-height: 1.4;
            color: #424242;
        }
    `;
    document.head.appendChild(style);
}

// 隐藏模拟结果
function hideSimulationResults() {
    document.getElementById('simulationResults').style.display = 'none';
}

// 切换配置编辑模式
function toggleConfigEdit() {
    const inputs = document.querySelectorAll('.simulation-config input');
    const configActions = document.querySelector('.config-actions');
    const editBtn = document.querySelector('.edit-config-btn');
    
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });
    
    configActions.style.display = configActions.style.display === 'none' ? 'flex' : 'none';
    editBtn.style.display = editBtn.style.display === 'none' ? 'flex' : 'none';
}

// 保存配置
function saveConfig() {
    // 禁用保存按钮，防止重复点击
    const saveBtn = document.querySelector('.save-config-btn');
    saveBtn.disabled = true;
    saveBtn.style.opacity = '0.7';

    // 更新配置
    SIMULATION_CONFIG.DAY_DURATION = parseInt(document.getElementById('dayDuration').value);
    SIMULATION_CONFIG.MALE_DURATION = parseInt(document.getElementById('maleDuration').value);
    SIMULATION_CONFIG.FEMALE_DURATION = parseInt(document.getElementById('femaleDuration').value);
    SIMULATION_CONFIG.FEMALE_WAIT_LIMIT = parseInt(document.getElementById('waitLimit').value);
    
    SIMULATION_CONFIG.PEAK_HOURS[0].ratio = parseFloat(document.getElementById('peakRatio1').value);
    SIMULATION_CONFIG.PEAK_HOURS[1].ratio = parseFloat(document.getElementById('peakRatio2').value);
    SIMULATION_CONFIG.PEAK_HOURS[2].ratio = parseFloat(document.getElementById('peakRatio3').value);
    
    // 保存跨年模式配置
    SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled = document.getElementById('newYearMode').checked;
    if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
        const peakRatio4 = document.getElementById('peakRatio4');
        if (peakRatio4) {
            SIMULATION_CONFIG.NEW_YEAR_EVENT.peakRatio = parseFloat(peakRatio4.value);
        }
    }
  
    SIMULATION_CONFIG.DAILY_VISITORS.WEEKDAY = parseInt(document.getElementById('weekdayFlow').value);
    SIMULATION_CONFIG.DAILY_VISITORS.WEEKEND = parseInt(document.getElementById('weekendFlow').value);
    SIMULATION_CONFIG.DAILY_VISITORS.HOLIDAY = parseInt(document.getElementById('holidayFlow').value);
    
    SIMULATION_CONFIG.TOILET_USAGE_RATIO = parseFloat(document.getElementById('usageRatio').value);
    
    // 提示保存成功
    showToast('配置已更新，可以重新开始模拟', 'success');
    
    // 如果开启了跨年模式，自动添加更多临时厕所
    if (SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled) {
        // 跨年专用临时厕所位置数据
        const newYearLocations = {
            '西湖公园公厕': [
                {
                    name: '音乐喷泉广场临时公厕A',
                    location: '距离西湖公园公厕180米',
                    space: '空地面积约200平方米',
                    recommended: { female: 24, male: 12 }
                },
                {
                    name: '湖滨步行街临时公厕A',
                    location: '距离西湖公园公厕250米',
                    space: '空地面积约180平方米',
                    recommended: { female: 20, male: 10 }
                },
                {
                    name: '湖滨银泰临时公厕A',
                    location: '距离西湖公园公厕320米',
                    space: '商场外广场200平方米',
                    recommended: { female: 22, male: 10 }
                },
                {
                    name: '平海路临时公厕',
                    location: '距离西湖公园公厕280米',
                    space: '街道空地150平方米',
                    recommended: { female: 18, male: 8 }
                },
                {
                    name: '西湖大道临时公厕',
                    location: '距离西湖公园公厕400米',
                    space: '人行道旁200平方米',
                    recommended: { female: 20, male: 10 }
                }
            ],
            '断桥公厕': [
                {
                    name: '断桥广场临时公厕A',
                    location: '距离断桥公厕120米',
                    space: '空地面积约220平方米',
                    recommended: { female: 26, male: 12 }
                },
                {
                    name: '断桥广场临时公厕B',
                    location: '距离断桥公厕150米',
                    space: '广场东侧180平方米',
                    recommended: { female: 20, male: 10 }
                },
                {
                    name: '白堤入口临时公厕A',
                    location: '距离断桥公厕200米',
                    space: '空地面积约180平方米',
                    recommended: { female: 22, male: 10 }
                },
                {
                    name: '白堤入口临时公厕B',
                    location: '距离断桥公厕230米',
                    space: '入口广场160平方米',
                    recommended: { female: 18, male: 8 }
                },
                {
                    name: '北山街临时公厕',
                    location: '距离断桥公厕280米',
                    space: '街道旁空地170平方米',
                    recommended: { female: 20, male: 10 }
                },
                {
                    name: '龙翔桥临时公厕',
                    location: '距离断桥公厕350米',
                    space: '桥头广场190平方米',
                    recommended: { female: 22, male: 10 }
                }
            ],
            '雷峰塔公厕': [
                {
                    name: '雷峰塔广场临时公厕A',
                    location: '距离雷峰塔公厕150米',
                    space: '空地面积约240平方米',
                    recommended: { female: 28, male: 14 }
                },
                {
                    name: '雷峰塔广场临时公厕B',
                    location: '距离雷峰塔公厕180米',
                    space: '广场西侧200平方米',
                    recommended: { female: 24, male: 12 }
                },
                {
                    name: '景区南门临时公厕A',
                    location: '距离雷峰塔公厕280米',
                    space: '空地面积约200平方米',
                    recommended: { female: 24, male: 12 }
                },
                {
                    name: '景区南门临时公厕B',
                    location: '距离雷峰塔公厕320米',
                    space: '南门广场180平方米',
                    recommended: { female: 20, male: 10 }
                },
                {
                    name: '南山路临时公厕A',
                    location: '距离雷峰塔公厕400米',
                    space: '街道旁空地160平方米',
                    recommended: { female: 18, male: 8 }
                },
                {
                    name: '南山路临时公厕B',
                    location: '距离雷峰塔公厕450米',
                    space: '商业区入口处190平方米',
                    recommended: { female: 22, male: 10 }
                }
            ],
            '苏堤公厕': [
                {
                    name: '苏堤入口临时公厕A',
                    location: '距离苏堤公厕150米',
                    space: '入口广场220平方米',
                    recommended: { female: 26, male: 12 }
                },
                {
                    name: '苏堤入口临时公厕B',
                    location: '距离苏堤公厕200米',
                    space: '广场南侧180平方米',
                    recommended: { female: 20, male: 10 }
                },
                {
                    name: '花港观鱼临时公厕',
                    location: '距离苏堤公厕280米',
                    space: '景区入口处200平方米',
                    recommended: { female: 24, male: 12 }
                },
                {
                    name: '曲院风荷临时公厕',
                    location: '距离苏堤公厕350米',
                    space: '景点入口处190平方米',
                    recommended: { female: 22, male: 10 }
                }
            ]
        };

        // 获取现有厕所数据
        let toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
        const lastId = Math.max(...toiletsData.map(t => t.id));
        let idCounter = lastId + 1;

        // 为每个主要厕所添加临时厕所
        Object.entries(newYearLocations).forEach(([parentName, locations]) => {
            // 检查是否已经添加过这些临时厕所
            const existingTemporary = toiletsData.filter(t => 
                t.isTemporary && t.parentToilet === parentName
            );

            if (existingTemporary.length === 0) {
                // 创建新的临时厕所
                const newToilets = locations.map(loc => ({
                    id: idCounter++,
                    name: loc.name,
                    address: loc.location,
                    distance: loc.location.match(/\d+米/)[0],
                    status: '正常',
                    rating: 0,
                    ratingCount: 0,
                    isTemporary: true,
                    parentToilet: parentName,
                    stalls: [
                        ...Array(loc.recommended.female).fill().map(() => ({ 
                            status: '空', 
                            gender: '女', 
                            state: 'empty', 
                            reservedBy: null 
                        })),
                        ...Array(loc.recommended.male).fill().map(() => ({ 
                            status: '空', 
                            gender: '男', 
                            state: 'empty', 
                            reservedBy: null 
                        }))
                    ]
                }));

                // 添加新厕所数据
                toiletsData.push(...newToilets);
            }
        });

        // 保存更新后的数据
        localStorage.setItem('toiletsData', JSON.stringify(toiletsData));

        // 短暂延迟后关闭面板并切换到首页
        setTimeout(() => {
            toggleConfigPanel();
            // 恢复保存按钮状态
            saveBtn.disabled = false;
            saveBtn.style.opacity = '1';
            
            // 切换到首页
            switchTab('home');
            // 强制重新渲染首页列表
            initPage();
            
            // 显示提示
            showToast('已自动添加跨年临时厕所设施', 'success');
        }, 800);
    } else {
        // 原有的关闭面板逻辑
        setTimeout(() => {
            toggleConfigPanel();
            saveBtn.disabled = false;
            saveBtn.style.opacity = '1';
        }, 800);
    }
}

// 取消编辑
function cancelConfigEdit() {
    // 恢复原始值
    document.getElementById('dayDuration').value = SIMULATION_CONFIG.DAY_DURATION;
    document.getElementById('maleDuration').value = SIMULATION_CONFIG.MALE_DURATION;
    document.getElementById('femaleDuration').value = SIMULATION_CONFIG.FEMALE_DURATION;
    document.getElementById('waitLimit').value = SIMULATION_CONFIG.FEMALE_WAIT_LIMIT;
    
    document.getElementById('peakRatio1').value = SIMULATION_CONFIG.PEAK_HOURS[0].ratio;
    document.getElementById('peakRatio2').value = SIMULATION_CONFIG.PEAK_HOURS[1].ratio;
    document.getElementById('peakRatio3').value = SIMULATION_CONFIG.PEAK_HOURS[2].ratio;
    
    document.getElementById('weekdayFlow').value = SIMULATION_CONFIG.DAILY_VISITORS.WEEKDAY;
    document.getElementById('weekendFlow').value = SIMULATION_CONFIG.DAILY_VISITORS.WEEKEND;
    document.getElementById('holidayFlow').value = SIMULATION_CONFIG.DAILY_VISITORS.HOLIDAY;
    
    document.getElementById('usageRatio').value = SIMULATION_CONFIG.TOILET_USAGE_RATIO;
    
    // 退出编辑模式
    toggleConfigEdit();
}

// 添加临时厕所
function addTemporaryToilets(data) {
    // 禁用添加按钮
    const addButton = document.getElementById(`add-toilet-${data.parentName.replace(/\s+/g, '-')}`);
    if (addButton) {
        addButton.disabled = true;
        addButton.innerHTML = '<i class="fas fa-check"></i> 已添加';
        addButton.style.backgroundColor = '#999';
        addButton.style.cursor = 'not-allowed';
    }

    const toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
    const lastId = Math.max(...toiletsData.map(t => t.id));
    
    // 创建新的临时厕所数据
    const newToilets = data.locations.map((loc, index) => ({
        id: lastId + index + 1,
        name: loc.name,
        address: loc.location,
        distance: loc.location.match(/\d+米/)[0],
        status: '正常',
        rating: 0,
        ratingCount: 0,
        isTemporary: true,
        parentToilet: data.parentName,
        stalls: [
            ...Array(loc.recommended.female).fill().map(() => ({ 
                status: '空', 
                gender: '女', 
                state: 'empty', 
                reservedBy: null 
            })),
            ...Array(loc.recommended.male).fill().map(() => ({ 
                status: '空', 
                gender: '男', 
                state: 'empty', 
                reservedBy: null 
            }))
        ]
    }));

    // 添加新厕所数据
    toiletsData.push(...newToilets);
    localStorage.setItem('toiletsData', JSON.stringify(toiletsData));

    // 保存模拟结果的显示状态
    localStorage.setItem('simulationResultsVisible', 'true');

    // 切换到首页并滚动到新添加的厕所
    switchTab('home');
    
    // 强制重新渲染首页列表
    initPage();
    
    // 等待页面更新后滚动到新厕所位置
    setTimeout(() => {
        const newToiletElements = newToilets.map(t => 
            document.querySelector(`[data-toilet-id="${t.id}"]`)
        );
        
        if (newToiletElements[0]) {
            newToiletElements[0].scrollIntoView({ behavior: 'smooth' });
            
            // 添加高亮动画效果
            newToiletElements.forEach(el => {
                el.classList.add('new-toilet');
                // 5秒后移除高亮效果
                setTimeout(() => el.classList.remove('new-toilet'), 5000);
            });
        }
    }, 300); // 增加延时确保DOM更新完成
}

// 切换配置面板
function toggleConfigPanel() {
    const configPanel = document.getElementById('configPanel');
    configPanel.classList.toggle('active');
}

// 重置配置到默认值
function resetConfig() {
    // 恢复所有配置到默认值
    document.getElementById('dayDuration').value = 1440;
    document.getElementById('maleDuration').value = 2;
    document.getElementById('femaleDuration').value = 6;
    document.getElementById('waitLimit').value = 20;
    
    document.getElementById('peakRatio1').value = 2.5;
    document.getElementById('peakRatio2').value = 2.0;
    document.getElementById('peakRatio3').value = 1.8;
    
    document.getElementById('weekdayFlow').value = 50000;
    document.getElementById('weekendFlow').value = 100000;
    document.getElementById('holidayFlow').value = 150000;
    
    document.getElementById('usageRatio').value = 0.4;
    document.getElementById('newYearMode').checked = false;
    
    // 移除午夜高峰配置（如果存在）
    const midnightPeak = document.querySelector('.midnight-peak');
    if (midnightPeak) {
        midnightPeak.remove();
    }
    
    showToast('已重置为默认配置', 'success');
}

// 更新跨年模式相关配置
function updateNewYearConfig(event) {
    const isNewYearMode = event.target.checked;
    SIMULATION_CONFIG.NEW_YEAR_EVENT.enabled = isNewYearMode;
  
    // 保存跨年模式状态到本地存储
    try {
        localStorage.setItem('newYearMode', JSON.stringify({
            enabled: isNewYearMode,
            config: {
                dayDuration: isNewYearMode ? 1590 : SIMULATION_CONFIG.DAY_DURATION,
                maleDuration: isNewYearMode ? 
                    Math.round(SIMULATION_CONFIG.MALE_DURATION * SIMULATION_CONFIG.NEW_YEAR_EVENT.durationMultiplier) : 
                    SIMULATION_CONFIG.MALE_DURATION,
                femaleDuration: isNewYearMode ? 
                    Math.round(SIMULATION_CONFIG.FEMALE_DURATION * SIMULATION_CONFIG.NEW_YEAR_EVENT.durationMultiplier) : 
                    SIMULATION_CONFIG.FEMALE_DURATION,
                weekdayFlow: isNewYearMode ? 
                    Math.round(SIMULATION_CONFIG.DAILY_VISITORS.WEEKDAY * SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier) : 
                    SIMULATION_CONFIG.DAILY_VISITORS.WEEKDAY,
                weekendFlow: isNewYearMode ? 
                    Math.round(SIMULATION_CONFIG.DAILY_VISITORS.WEEKEND * SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier) : 
                    SIMULATION_CONFIG.DAILY_VISITORS.WEEKEND,
                holidayFlow: isNewYearMode ? 
                    Math.round(SIMULATION_CONFIG.DAILY_VISITORS.HOLIDAY * SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier) : 
                    SIMULATION_CONFIG.DAILY_VISITORS.HOLIDAY
            }
        }));
    } catch (e) {
        console.warn('Failed to save new year mode state:', e);
    }
  
    // 获取高峰时段容器
    const peakHoursContainer = document.querySelector('.peak-hours');
  
    // 显示/隐藏说明文字
    const newYearNote = document.getElementById('newYearNote');
    newYearNote.classList.toggle('active', isNewYearMode);
  
    // 需要添加视觉提示的元素
    const affectedElements = [
        'dayDurationWrapper',
        'maleDurationWrapper',
        'femaleDurationWrapper',
        'weekdayFlowWrapper',
        'weekendFlowWrapper',
        'holidayFlowWrapper'
    ];
  
    if (isNewYearMode) {
        // 添加视觉提示
        affectedElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('new-year-affected');
            }
        });
  
        // 更新每天时间长度（延长到次日2:30，即原有1440分钟 + 150分钟）
        document.getElementById('dayDuration').value = 1590; // 1440 + 150
        document.getElementById('dayDuration').disabled = false;
  
        // 添加午夜高峰配置
        if (!document.getElementById('peakRatio4')) {
            const midnightPeak = document.createElement('div');
            midnightPeak.className = 'peak-hour-item midnight-peak new-year-affected';
            midnightPeak.innerHTML = `
                <label>跨年高峰(22:30-00:30)：</label>
                <input type="number" step="0.1" id="peakRatio4" value="${SIMULATION_CONFIG.NEW_YEAR_EVENT.peakHours[0].ratio + SIMULATION_CONFIG.NEW_YEAR_EVENT.peakHours[1].ratio}" 
                    ${event.target.disabled ? 'disabled' : ''}>
                <span class="unit">倍</span>
            `;
            peakHoursContainer.appendChild(midnightPeak);
        }
  
        // 更新游客流量（使用整数）
        document.getElementById('weekdayFlow').value = 
            Math.round(SIMULATION_CONFIG.DAILY_VISITORS.WEEKDAY * SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier);
        document.getElementById('weekendFlow').value = 
            Math.round(SIMULATION_CONFIG.DAILY_VISITORS.WEEKEND * SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier);
        document.getElementById('holidayFlow').value = 
            Math.round(SIMULATION_CONFIG.DAILY_VISITORS.HOLIDAY * SIMULATION_CONFIG.NEW_YEAR_EVENT.visitorMultiplier);
  
        // 更新如厕时间（使用整数）
        document.getElementById('maleDuration').value = 
            Math.round(SIMULATION_CONFIG.MALE_DURATION * SIMULATION_CONFIG.NEW_YEAR_EVENT.durationMultiplier);
        document.getElementById('femaleDuration').value = 
            Math.round(SIMULATION_CONFIG.FEMALE_DURATION * SIMULATION_CONFIG.NEW_YEAR_EVENT.durationMultiplier);
  
        // 禁用这些输入框，因为它们现在由跨年模式控制
        document.getElementById('weekdayFlow').disabled = true;
        document.getElementById('weekendFlow').disabled = true;
        document.getElementById('holidayFlow').disabled = true;
        document.getElementById('maleDuration').disabled = true;
        document.getElementById('femaleDuration').disabled = true;
    } else {
        // 移除视觉提示
        affectedElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.remove('new-year-affected');
            }
        });
  
        // 移除午夜高峰配置
        const midnightPeak = document.querySelector('.midnight-peak');
        if (midnightPeak) {
            midnightPeak.remove();
        }
  
        // 移除所有跨年临时厕所
        let toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
        const originalToilets = toiletsData.filter(t => !t.isTemporary);
        
        // 如果确实移除了临时厕所，才保存和提示
        if (toiletsData.length !== originalToilets.length) {
            localStorage.setItem('toiletsData', JSON.stringify(originalToilets));
            
            // 切换到首页并刷新列表
            switchTab('home');
            initPage();
            
            // 显示提示
            showToast('已移除跨年临时厕所设施', 'info');
        }
  
        // 调用重置配置函数
        resetConfig();
  
        // 启用所有输入框
        document.querySelectorAll('.simulation-config input').forEach(input => {
            input.disabled = false;
        });
    }
}

// 页面加载时恢复跨年模式状态
document.addEventListener('DOMContentLoaded', () => {
    try {
        const savedNewYearMode = localStorage.getItem('newYearMode');
        if (savedNewYearMode) {
            const { enabled, config } = JSON.parse(savedNewYearMode);
            
            // 恢复跨年模式开关状态
            const newYearModeCheckbox = document.getElementById('newYearMode');
            if (newYearModeCheckbox) {
                newYearModeCheckbox.checked = enabled;
                // 触发配置更新
                newYearModeCheckbox.dispatchEvent(new Event('change'));
            }
        }
    } catch (e) {
        console.warn('Failed to restore new year mode state:', e);
    }
}); 