const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");

class stadiumsDAL {
  async getStadiumById(stadiumId) {
    try {
      const stadium = await axios.get(`${api_domain}/venues/${stadiumId}`,
        {
          params: {
            api_token: process.env.sportmonks_api_token,
          },
        }
      );

      if (stadium.data.data) {
        return {
          id: stadium.data.data.id,
          name: stadium.data.data.name,
        };
      }
      else {
        return null
      }
    } catch {
      return null
    }
  }
}

module.exports = stadiumsDAL
