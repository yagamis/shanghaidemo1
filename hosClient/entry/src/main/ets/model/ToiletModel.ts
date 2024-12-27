export class ToiletModel {
  id: number;
  name: string;
  address: string;
  distance: string;
  status: string;
  rating: number;
  ratingCount: number;
  stalls: StallModel[];

  constructor(id: number, name: string, address: string, distance: string) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.distance = distance;
    this.status = '正常';
    this.rating = 0;
    this.ratingCount = 0;
    this.stalls = [];
  }
}

export class StallModel {
  number: number;
  gender: string;
  status: string;
  state: string;
  moduleId = ''
  unlockTime?: number;

  constructor(number: number, gender: string, state: string = 'empty') {
    this.number = number;
    this.gender = gender;
    this.state = state;
    this.status = this.getStatusText(state);
  }


   getStatusText(state: string): string {
    const statusMap: Record<string,string> = {
      'empty': '空闲',
      'occupied': '占用',
      'fault': '故障',
      'maintenance': '维修',
      'disabled': '禁用',
      'smoke': '烟雾'
    };
    return statusMap[state] || '未知';
  }
}

export let toiletsInitData: ToiletModel[] = [
  new ToiletModel(
    1,
    '南京路步行街公厕',
    '上海市黄浦区南京东路168号',
    '0.2km'
  ),
  new ToiletModel(
    2,
    '人民广场公厕',
    '上海市黄浦区南京西路1号',
    '0.5km'
  ),
  new ToiletModel(
    3,
    '南京路步行街中山东路公厕',
    '上海市黄浦区南京东路555号',
    '0.8km'
  ),
  new ToiletModel(
    4,
    '外滩公厕',
    '上海市黄浦区中山东一路1号',
    '1.2km'
  ),
  new ToiletModel(
    5,
    '豫园公厕',
    '上海市黄浦区城隍庙豫园商城内',
    '1.5km'
  ),
  new ToiletModel(
    6,
    '上海博物馆公厕',
    '上海市黄浦区人民大道201号',
    '1.8km'
  ),
  new ToiletModel(
    7,
    '上海大剧院公厕',
    '上海市黄浦区人民大道288号',
    '2.1km'
  ),
  new ToiletModel(
    8,
    '上海图书馆公厕',
    '上海市徐汇区淮海中路1555号',
    '2.5km'
  )
]

toiletsInitData[0].stalls = [
  new StallModel(1, '男', 'empty'),
  new StallModel(2, '男', 'occupied'),
  new StallModel(3, '男', 'empty'),
  new StallModel(4, '男', 'fault'),
  new StallModel(5, '男', 'empty')
]
toiletsInitData[0].rating = 4.5
toiletsInitData[0].ratingCount = 200

toiletsInitData[1].stalls = [
  new StallModel(1, '女', 'empty'),
  new StallModel(2, '女', 'occupied'),
  new StallModel(3, '女', 'empty'),
  new StallModel(4, '女', 'fault'),
  new StallModel(5, '女', 'empty')
]
toiletsInitData[1].rating = 4.0
toiletsInitData[1].ratingCount = 150

toiletsInitData[2].stalls = [
  new StallModel(1, '男', 'empty'),
  new StallModel(2, '男', 'occupied'),
  new StallModel(3, '男', 'empty'),
  new StallModel(4, '男', 'fault'),
  new StallModel(5, '男', 'empty')
]
toiletsInitData[2].rating = 4.2
toiletsInitData[2].ratingCount = 180

toiletsInitData[3].stalls = [
  new StallModel(1, '女', 'empty'),
  new StallModel(2, '女', 'occupied'),
  new StallModel(3, '女', 'empty'),
  new StallModel(4, '女', 'fault'),
  new StallModel(5, '女', 'empty')
]
toiletsInitData[3].rating = 4.8
toiletsInitData[3].ratingCount = 220

toiletsInitData[4].stalls = [
  new StallModel(1, '男', 'empty'),
  new StallModel(2, '男', 'occupied'),
  new StallModel(3, '男', 'empty'),
  new StallModel(4, '男', 'fault'),
  new StallModel(5, '男', 'empty')
]
toiletsInitData[4].rating = 4.6
toiletsInitData[4].ratingCount = 210

toiletsInitData[5].stalls = [
  new StallModel(1, '男', 'empty'),
  new StallModel(2, '男', 'empty'),
  new StallModel(3, '男', 'occupied'),
  new StallModel(4, '男', 'empty'),
  new StallModel(5, '女', 'empty'),
  new StallModel(6, '女', 'occupied'),
  new StallModel(7, '女', 'empty'),
  new StallModel(8, '女', 'empty')
]
toiletsInitData[5].rating = 4.3
toiletsInitData[5].ratingCount = 175

toiletsInitData[6].stalls = [
  new StallModel(1, '男', 'empty'),
  new StallModel(2, '男', 'occupied'),
  new StallModel(3, '男', 'maintenance'),
  new StallModel(4, '女', 'empty'),
  new StallModel(5, '女', 'empty'),
  new StallModel(6, '女', 'occupied')
]
toiletsInitData[6].rating = 4.4
toiletsInitData[6].ratingCount = 160

toiletsInitData[7].stalls = [
  new StallModel(1, '男', 'empty'),
  new StallModel(2, '男', 'occupied'),
  new StallModel(3, '男', 'empty'),
  new StallModel(4, '女', 'empty'),
  new StallModel(5, '女', 'occupied'),
  new StallModel(6, '女', 'empty'),
  new StallModel(7, '女', 'disabled')
]
toiletsInitData[7].rating = 4.1
toiletsInitData[7].ratingCount = 145



