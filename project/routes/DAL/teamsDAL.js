const DButils = require("../utils/DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");

// TODO: tests
class teamsDAL {
  async getTeamById(teamId) {
    const team = await axios.get(`${api_domain}/teams/${teamId}`,
      {
        params: {
          include: 'league',
          api_token: process.env.sportmonks_api_token,
        },
      }
    );

    if (team.data.data) {
      return {
        id: team.data.data.id,
        name: team.data.data.name,
        leagueId: team.data.data.league.data.id
      };
    }
    else {
      return null
    }
  }
}

module.exports = teamsDAL
