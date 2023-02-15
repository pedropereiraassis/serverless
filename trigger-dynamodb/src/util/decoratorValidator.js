const decoratorValidator = (fn, schema, argsType) => {
  return async function (event) {
    const data = JSON.parse(event[argsType]);
    // abortEarly === show all errors at once
    const { error, value } = await schema.validate(
      data, { abortEarly: true }
    );
    // alter arguments instance
    event[argsType] = value;

    // arguments get all ~arguments from fuction (fn) execution and send forward
    // apply return the function that will be executed afterwards
    if (!error) {
      return fn.apply(this, arguments);
    } else {
      return {
        statusCode: 422, // unprocessable entity
        body: error.message
      }
    }
  }
}

module.exports = decoratorValidator;