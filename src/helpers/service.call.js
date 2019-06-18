const PRICE = "https://ripio.com/api/v1/rates/";
const FEE = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
const WALLET =
  "https://us-central1-rest-api-15298.cloudfunctions.net/api/wallet";
const HISTORY =
  "https://us-central1-rest-api-15298.cloudfunctions.net/api/history";

const LH_WALLET = "http://localhost:5000/rest-api-15298/us-central1/api/wallet";

export async function ServerCallPrices() {
  try {
    const response = await fetch(PRICE);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function ServerCallFee() {
  try {
    const response = await fetch(FEE);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function ServerCallWallet() {
  try {
    const response = await fetch(WALLET);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function serverCallPut(address, monto) {
  try {
    const send = await fetch(WALLET + `/${address}`, {
      /* Para forzar error de envio colocar LH_WALLET en lugar de WALLET */
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: address,
        balance: monto
      })
    });
    const send_1 = await send.json();
    return send_1;
  } catch (error) {
    return error;
  }
}

export async function ServerCallHistory() {
  try {
    const response = await fetch(HISTORY);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function serverCallPost(address, fecha, monto, fee, error) {
  const send = await fetch(HISTORY, {
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
  });
  return internalServerCall(requestOptions);
}

async function internalServerCall(requestOptions) {
  const response = await fetch(HISTORY, requestOptions);
  const text = await response.text();
  const data = text && JSON.parse(text);
  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }
  return data;
}
