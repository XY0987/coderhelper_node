/* 
这里使用的是全局的，而不是类内部的
因为使用类内部的每次连接的时候都会new一个meetingWs实例
每次new又会创建一个新的userMap
*/
const userMap = new Map();
export class MeetingWs {
  roomKey: string;
  redisService: any;
  constructor(redisServer: any, ws: any) {
    this.roomKey = 'meeting-room::';
    this.redisService = redisServer;
    this.onListener(ws);
  }

  getParams(url, queryName) {
    let query = decodeURI(url.split('?')[1]);
    let vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === queryName) {
        return pair[1];
      }
    }
    return null;
  }

  getMsg(type, msg, status = 200, data = null) {
    return { type: type, msg: msg, status: status, data: data };
  }

  oneToOne(uid, msg) {
    //   console.log(uid, msg);
    let s = userMap.get(uid);
    if (s) {
      s.emit('msg', msg);
    } else {
      console.log(uid + '用户不在线');
    }
  }

  async getRoomUser(roomId) {
    return await this.redisService.hGetAll(this.roomKey + roomId);
  }

  // 获取房间用户列表(list)
  async getRoomOnlyUserList(roomId) {
    let resList = [];
    let uMap: any = await this.redisService.hGetAll(this.roomKey + roomId);
    for (const key in uMap) {
      let detail = JSON.parse(uMap[key]);
      resList.push(detail);
    }
    return resList;
  }

  async oneToRoomMany(roomId, msg) {
    let uMap: any = await this.getRoomUser(roomId);
    for (const uid in uMap) {
      this.oneToOne(uid, msg);
    }
  }

  getUserDetailByUid(userId, roomId, nickname, pub) {
    let res = JSON.stringify({
      userId: userId,
      roomId: roomId,
      nickname: nickname,
      pub: pub,
    });
    return res;
  }

  async onListener(s) {
    let url = s.client.request.url;
    let userId = this.getParams(url, 'userId');
    let roomId = this.getParams(url, 'roomId');
    if (!roomId) {
      return;
    }
    let nickname = this.getParams(url, 'nickname');
    let pub = this.getParams(url, 'pub');
    userMap.set(userId, s);
    //room cache
    if (roomId) {
      await this.redisService.hSet(
        this.roomKey + roomId,
        userId,
        this.getUserDetailByUid(userId, roomId, nickname, pub),
      );
      this.oneToRoomMany(
        roomId,
        this.getMsg('join', userId + ' join then room', 200, {
          userId: userId,
          nickname: nickname,
        }),
      );
    }

    s.on('msg', async (data) => {
      console.log('msg', data);
      await this.oneToRoomMany(roomId, data);
    });

    s.on('disconnect', () => {
      console.log(
        'client uid：' +
          userId +
          ' roomId: ' +
          roomId +
          ' 【' +
          nickname +
          '】 offline ',
      );
      userMap.delete(userId);
      if (roomId) {
        this.redisService.hDel(this.roomKey + roomId, userId);
        this.oneToRoomMany(
          roomId,
          this.getMsg('leave', userId + ' leave the room ', 200, {
            userId: userId,
            nickname: nickname,
          }),
        );
      }
    });

    s.on('roomUserList', async (data) => {
      // console.log("roomUserList msg",data)
      s.emit('roomUserList', await this.getRoomOnlyUserList(data['roomId']));
    });
    s.on('call', (data) => {
      console.log(data);
      let targetUid = data['targetUid'];
      this.oneToOne(targetUid, this.getMsg('call', '远程呼叫', 200, data));
    });
    s.on('candidate', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(
        targetUid,
        this.getMsg('candidate', 'ice candidate', 200, data),
      );
    });
    s.on('offer', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(targetUid, this.getMsg('offer', 'rtc offer', 200, data));
    });
    s.on('answer', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(targetUid, this.getMsg('answer', 'rtc answer', 200, data));
    });
    s.on('applyMic', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(targetUid, this.getMsg('applyMic', 'apply mic', 200, data));
    });
    s.on('acceptApplyMic', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(
        targetUid,
        this.getMsg('acceptApplyMic', 'acceptApplyMic mic', 200, data),
      );
    });
    s.on('refuseApplyMic', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(
        targetUid,
        this.getMsg('refuseApplyMic', 'refuseApplyMic mic', 200, data),
      );
    });
    s.on('beforeCall', (data) => {
      let targetUid = data['targetUid'];
      this.oneToOne(
        targetUid,
        this.getMsg('beforeCall', '呼叫之前的确定', 200, data),
      );
    });
    s.on('success', (data) => {
      // 消息传送给打电话的人,走正常的打电话流程
      let userId = data['userId'];
      this.oneToOne(userId, this.getMsg('success', '确定回复', 200, data));
    });
  }
}
