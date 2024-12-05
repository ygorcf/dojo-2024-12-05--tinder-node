const FormData = require('form-data');
const http = require('http');


class RequestUtil {
  constructor(
    requestLib = http,
  ) {
    this.requestLib = requestLib
  }

  async sendRequest(
    method,
    url,
    body = null,
    options = {}
  ) {
    const dadosCorpo = this.converterCorpoRequest(body);

    return new Promise((resolve, reject) => {
      const request = this.requestLib.request(
        this.adicionarParamsNaUrl(url, options.query || {}),
        {
          ...options,
          method: method.toUpperCase(),
        },
        (response) => {
          const respostas = [];

          response.setEncoding('utf8');
          response.on('error', (erro) => {
            reject(erro);
          });
          response.on('data', (parteResposta) => {
            respostas.push(parteResposta);
          });
          response.on('end', () => {
            resolve({
              statusCode: response.statusCode || 400,
              body: this.converterResposta(response, respostas),
              headers: response.headers
            });
          });
        }
      );

      request.on('error', (e) => reject(e));

      if (dadosCorpo.corpo) {
        this.adicionarCorpoNaRequest(dadosCorpo.corpo, request);
      }

      request.end();
    });
  }

  get(url, options) {
    return this.sendRequest('get', url, null, options);
  }

  post(url, body, options) {
    return this.sendRequest('post', url, body, options);
  }

  patch(url, body = null, options) {
    return this.sendRequest('patch', url, body, options);
  }

  put(url, body, options) {
    return this.sendRequest('put', url, body, options);
  }

  delete(url, options) {
    return this.sendRequest('delete', url, null, options);
  }

  converterCorpoRequest(corpo) {
    if (corpo === null) {
      return {
        corpo,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 0
        }
      };
    }

    if (corpo instanceof FormData) {
      return {
        corpo,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
    }

    const corpoString = JSON.stringify(corpo);
    return {
      corpo,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(corpoString)
      }
    };
  }

  adicionarCorpoNaRequest(
    corpo,
    request
  ) {
    if (corpo instanceof FormData) {
      corpo.pipe(request);
      return;
    }

    request.write(corpo);
  }

  converterResposta(
    response,
    respostas
  ) {
    if (respostas.length === 0) {
      return undefined;
    }

    const respostaCompleta = respostas.join('');
    const cabecalhoContentType = response.headers['content-type']?.split(/; ?/g);

    if (cabecalhoContentType[0] === 'application/json') {
      return JSON.parse(respostaCompleta);
    }

    return respostaCompleta;
  }

  adicionarParamsNaUrl(url, paramsQuery) {
    const paramsList = Object.entries(paramsQuery);

    if (paramsList.length === 0) {
      return url;
    }

    const paramsUrl = paramsList
      .map(
        ([chave, valor]) =>
          `${chave}=${valor === null ? 'null' : valor.toString()}`
      )
      .join('&');
    return `${url}?${paramsUrl}`;
  }
}

module.exports = {
  RequestUtil
}