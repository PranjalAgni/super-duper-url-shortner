const url = document.querySelector('#url');
const keyword = document.querySelector('#keyword');

const btn = document.querySelector('#submit');
const backendNowAPI = 'https://url-shortener-backend.being-pranjal.now.sh';

const output = document.querySelector('#output');
output.style.display = 'none';

btn.addEventListener('click', async event => {
  event.preventDefault();

  const result = await fetch(`${backendNowAPI}/api/url`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url.value,
      keyword: keyword.value
    })
  });
  if (result.status == 201) {
    swal('Good job!', 'Your url was shortenified!', 'success');
    let output = document.querySelector('#output');
    output.style.display = 'block';
  } else {
    swal('Ohh no!', `Some error occured ${result.status}`, 'error');
  }
});
