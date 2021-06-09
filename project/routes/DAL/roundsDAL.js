const DButils = require("../utils/DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");

class roundsDAL {
  async getRoundById(roundId) {
    try {
      const round = await axios.get(`${api_domain}/rounds/${roundId}`,
        {
          params: {
            api_token: process.env.sportmonks_api_token,
          },
        }
      );

      if (round.data.data) {
        return {
          id: round.data.data.id,
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

module.exports = roundsDAL
