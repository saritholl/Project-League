const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");

class teamsDAL {
  async getTeamById(teamId) {
    try {
      const team = await axios.get(`${api_domain}/teams/${teamId}`,
        {
          params: {
            api_token: process.env.sportmonks_api_token,
          },
        }
      );

      if (team.data.data) {
        return {
          id: team.data.data.id,
          name: team.data.data.name,
          leagueId: team.data.data.country_id
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

module.exports = teamsDAL
