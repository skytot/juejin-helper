const axios = require('axios');

class GladosCheckIn {
  constructor(cookie) {
    this.cookie = cookie;
  }

  async run() {
    if (!this.cookie) {
      return "⚠️ 未配置 Glados Cookie，已跳过";
    }

    const url = "https://glados.cloud/api/user/checkin";
    const urlStatus = "https://glados.cloud/api/user/status";
    const origin = "https://glados.cloud";
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0";

    try {
      // 1. 执行签到
      const checkinRes = await axios.post(
        url,
        { token: "glados.cloud" },
        {
          headers: {
            cookie: this.cookie,
            origin: origin,
            "user-agent": userAgent,
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );

      const checkinData = checkinRes.data;

      // 2. 获取状态（剩余天数）
      const statusRes = await axios.get(
        urlStatus,
        {
          headers: {
            cookie: this.cookie,
            origin: origin,
            "user-agent": userAgent,
          },
        }
      );

      const statusData = statusRes.data;

      // 3. 组装返回结果
      if (checkinData.code === 0) {
        const remainingDays = statusData.data?.leftDays || 0;
        return `✅ Glados签到: ${checkinData.message} (剩余 ${remainingDays} 天)`;
      } else {
        return `⚠️ Glados签到: ${checkinData.message}`;
      }

    } catch (e) {
      return `❌ Glados签到: 请求失败 - ${e.message}`;
    }
  }
}

module.exports = GladosCheckIn;
