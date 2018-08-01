# Node-Structure

Call api from server

/**
 * @method test
 * @description 
 * @param 
 */
function test() {
    let deferred = q.defer();
    let apiOption = {
        url: STORE_URL + '',
        method: 'GET',
        headers: storeHeader,
        json: true
    };
    request(apiOption, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            
            deferred.resolve(body);
        } else {
            let errorLog = {
                MESSAGE: 'Error ....',
                API_URL: apiOption.url,
                STATUS_CODE: response.statusCode,
                RESPONSE_BODY: body,
                ERROR: error,
                DETAIL: {}
            };
            deferred.reject(errorLog);
        }
    });
    return deferred.promise;
}
