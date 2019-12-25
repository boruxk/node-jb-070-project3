import {createStore} from "redux";

export const ACTIONS = {
    'LOGGED': 'LOGGED'
}

const reducer = (model={requestedData:[]}, action) => {
    const updates = {
        "LOGGED": (model) => {
            model.requestedData = [];
            model.requestedData.push(action);
            return model;
        }
    }
    return (updates[action.type] || ((model) => model))(model);
}

export const container = createStore(reducer, {
    requestedData: []
});