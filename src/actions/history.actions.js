import { historyConstants } from "../constants/history.constants";
import { serverCallPost, ServerCallHistory } from "../helpers/service.call";

export function loading(data) {
  return { type: historyConstants.REQUEST, payload: { isLoading: data } };
}

export function getHistory() {
  return dispatch => {
    return ServerCallHistory().then(
      data => {
        return dispatch(success(data));
      },
      error => {
        return dispatch(failure(error.toString()));
      }
    );
  };

  function failure(error) {
    return { type: historyConstants.FAILURE_GET, error };
  }
  function success(data) {
    return { type: historyConstants.SUCCESS_GET, data };
  }
}

export function postHistory(address, fecha, monto, fee, error) {
  console.log("posting history");
  console.log("address :", address);
  console.log("fecha :", fecha);
  console.log("monto :", monto);
  console.log("fee :", fee);
  console.log("error :", error);
  return dispatch => {
    return serverCallPost(address, fecha, monto, fee, error).then(
      data => {
        return dispatch(success(data));
      },
      error => {
        return dispatch(failure(error.toString()));
      }
    );
  };

  function failure(error) {
    return { type: historyConstants.FAILURE_POST, error };
  }
  function success(data) {
    return { type: historyConstants.SUCCESS_POST, data };
  }
}
