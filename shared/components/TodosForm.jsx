import React from 'react';

export default class TodosForm extends React.Component {
    handleSubmit = () => {
        let node = this.refs['todo-input'];
        this.props.createTodo(node.value);
        node.value = '';
    }

    render() {
        return (
            <div id="todo-form">
                <input type="text" placeholder="Type Your Todo Here" ref="todo-input" />
                <input type="submit" value="Submit" onClick={this.handleSubmit} />
            </div>
        );
    }
};
