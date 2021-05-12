const TEAM_URL =
  'https://cricapi.com/api/matches?apikey=KUTvTOFTZcVYeV4lJhk9j9XXSSI2';

const MATCH_URL =
  'https://cricapi.com/api/fantasySummary?apikey=KUTvTOFTZcVYeV4lJhk9j9XXSSI2&';

const IPL_TEAM = [
  { name: 'Sunrisers Hyderabad', image: 'hydrabad.jpg' },
  { name: 'Delhi Capitals', image: 'delhi.jpg' },
  { name: 'Chennai Super Kings', image: 'csk.png' },
  { name: 'Royal Challengers Bangalore', image: 'rcb.jpg' },
  { name: 'Rajasthan Royals', image: 'rajastan.png' },
  { name: 'Kolkata Knight Riders', image: 'kolkota.png' },
  { name: 'Punjab Kings', image: 'panjab.png' },
  { name: 'Mumbai Indians', image: 'mumbai.png' },
];

function loadData() {
  fetch(TEAM_URL)
    .then((res) => res.json())
    .then((data) => filterMatches(data.matches));
}

function matchDetails(id) {
  fetch(MATCH_URL + `unique_id=${id}`)
    .then((res) => res.json())
    .then((data) => showMatchDetails(data));
}
loadData();
const flexContainer = document.querySelector('.flex-container');
function filterMatches(data) {
  const teamNames = IPL_TEAM.map((team) => team.name);
  const currentDate = new Date().getDate();
  const matches = data.filter(
    (match) =>
      (new Date(match.date).getDate() === currentDate ||
        new Date(match.date).getDate() === currentDate + 1) &&
      (teamNames.includes(match['team-1']) ||
        teamNames.includes(match['team-2']))
  );
  matches.forEach((match) => {
    const divEle = document.createElement('div');
    const teamName1 = match['team-1'];
    const teamName2 = match['team-2'];

    const teamImage1 =
      'img/' + IPL_TEAM.filter((team) => team.name === teamName1)[0].image;

    const teamImage2 =
      'img/' + IPL_TEAM.filter((team) => team.name === teamName2)[0].image;

    let innerHTML = `<span><img src=${teamImage1}> ${teamName1}</span>  <strong>v/s</strong> <span><img src=${teamImage2}>${teamName2}</span>`;
    divEle.setAttribute('id', match.unique_id);
    divEle.classList.add('team');
    if (match.matchStarted) {
      divEle.classList.add('match-started');
    } else {
      innerHTML = innerHTML + `<span class="new"> (new)</span>`;
    }
    divEle.innerHTML = innerHTML;
    flexContainer.append(divEle);
    divEle.addEventListener('click', teamHandler);
  });
}
const matchDetailEle = document.querySelector('.match-detail');
const matchDetailFlexEle = document.querySelector('.match-detail-flex');
const modalHeaderEle = document.querySelector('.modal-header');

function teamHandler(teamEle) {
  const unique_id =
    teamEle.target.parentNode.id === ''
      ? teamEle.target.parentNode.parentNode.id
      : teamEle.target.parentNode.id;
  flexContainer.classList.add('hide');
  matchDetailEle.classList.remove('hide');
  modalHeaderEle.classList.add('hide');
  matchDetails(unique_id);
}
const backBtn = document.querySelector('#back-btn');
backBtn.addEventListener('click', () => {
  flexContainer.classList.remove('hide');
  matchDetailEle.classList.add('hide');
  modalHeaderEle.classList.remove('hide');
  const matchWinnerEle = document.querySelector('.match-winner');
  if (matchWinnerEle !== null) {
    matchWinnerEle.remove();
  }
  const manOfTheMatchEle = document.querySelector('.man-of-the-match');
  if (manOfTheMatchEle !== null) {
    manOfTheMatchEle.remove();
  }
  const matchError = document.querySelector('.match-error');
  if (matchError !== null) {
    matchError.remove();
  }
  const matchNew = document.querySelector('.match-new');
  if (matchNew !== null) {
    matchNew.remove();
  }
});

function showMatchDetails({ data, error }) {
  if (error) {
    const divEle = document.createElement('div');
    divEle.innerText =
      'Oh Ho!, something went wrong. Please refresh and try again.';
    divEle.classList.add('match-error');
    matchDetailFlexEle.appendChild(divEle);
    console.log(error);
    return;
  }

  if (
    data.batting.length === 0 &&
    data.bowling.length === 0 &&
    data.fielding.length === 0
  ) {
    const divEle = document.createElement('div');
    divEle.innerText = 'Match not yet started, Please wait!!!';
    divEle.classList.add('match-new');
    matchDetailFlexEle.appendChild(divEle);
    return;
  }

  if (data.winner_team && data.winner_team != '') {
    const divEle = document.createElement('div');
    divEle.innerHTML = `<strong>Match winner:</strong> ${data.winner_team} `;
    divEle.classList.add('match-winner');
    matchDetailFlexEle.appendChild(divEle);
  }
  if (data['man-of-the-match']) {
    const divEle = document.createElement('div');
    divEle.innerHTML = `<strong>Man of the match:</strong> ${data['man-of-the-match'].name}`;
    divEle.classList.add('man-of-the-match');
    matchDetailFlexEle.appendChild(divEle);
  }
}
