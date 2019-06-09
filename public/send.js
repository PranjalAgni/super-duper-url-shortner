const url = document.querySelector('#url');
const keyword = document.querySelector('#keyword');

const btn = document.querySelector('#submit');

btn.addEventListener('click', async event => {
  event.preventDefault();

  const result = await fetch(`${window.location.origin}/api/url`, {
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
  if (result.status == 200) {
    swal('Good job!', 'Your url was shortenified!', 'success');
  } else {
    swal('Ohh no!', `Some error occured ${result.status}`, 'error');
  }
});
