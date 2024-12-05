const util = require('../util/request.util')

test('testando a página inicial', async () => {
    const request = new util.RequestUtil()
    const response = await request.get('http://localhost:8080/')

    expect(response.body).toBe('successooooooo')
});