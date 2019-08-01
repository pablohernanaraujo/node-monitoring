const handlers = {
  users: (data: object, callback: Function) => {
    const acetableMethod = ['post', 'get', 'put', 'delete'];
    if (acetableMethod.indexOf(data.method) > -1) {
      handlers._users[data.method](data, callback);
    } else {
      callback(405);
    }
  },
  _users: {
    post: (data: object, callback: Function) => {
      const email: string | boolean = data.payload.email
        ? data.payload.email
        : false;
      const password: string | boolean = data.payload.password
        ? data.payload.password
        : false;

      callback(data);
    },
    get: (data: object, callback: Function) => {
      callback(data);
    },
    put: (data: object, callback: Function) => {
      callback(data);
    },
    delete: (data: object, callback: Function) => {
      callback(data);
    },
  },
  ping: (data: object, callback: Function) => {
    callback(200);
  },
  notFound: (data: object, callback: Function) => {
    callback(404);
  },
};

export default handlers;
