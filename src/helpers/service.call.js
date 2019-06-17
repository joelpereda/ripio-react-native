const PRICE = "https://ripio.com/api/v1/rates/";
const FEE = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
const WALLET =
  "https://us-central1-rest-api-15298.cloudfunctions.net/api/wallet";
const HISTORY =
  "https://us-central1-rest-api-15298.cloudfunctions.net/api/history";

const LH_WALLET = "http://localhost:5000/rest-api-15298/us-central1/api/wallet";

export function ServerCallPrices() {
  return fetch(PRICE)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}

export function ServerCallFee() {
  return fetch(FEE)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}

export function ServerCallWallet() {
  return fetch(WALLET)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}

export function serverCallPut(address, monto) {
  return fetch(WALLET + `/${address}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      address: address,
      balance: monto
    })
  })
    .then(send => send.json())
    .then(send => {
      return send;
    })
    .catch(error => {
      return error;
    });
}

export function ServerCallHistory() {
  return fetch(HISTORY)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}

export function serverCallPost(address, fecha, monto, fee, error) {
  return fetch(HISTORY, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      address: address,
      date: fecha,
      monto: monto,
      fee: fee,
      error: error
    })
  }).then(send => {
    return internalServerCallPublic(requestOptions);
  });
}

function internalServerCallPublic(requestOptions) {
  return fetch(HISTORY, requestOptions).then(response => {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        const error = (data && data.error) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  });
}
