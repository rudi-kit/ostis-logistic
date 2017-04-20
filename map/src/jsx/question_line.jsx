var QuestionLine = React.createClass({
  propTypes: {
    questions: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {question: ''}
  },

  matchStateToTerm: function(state, value) {
    return state.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  },

  sortStates: function(a, b, value) {
    return a.toLowerCase().indexOf(value.toLowerCase()) > b.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1;
  },

  onChange: function(value, notify) {
    if (notify)
      this.props.onChange({question: value});
    this.setState({question: value});
  },

  render: function() {
    return (
      <ReactAutocomplete
        wrapperStyle={{display: 'block'}}
        inputProps={{placeholder: "Задайте вопрос", className: "form-control"}}
        menuStyle={{
          zIndex: "1000000",
          borderRadius: '3px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          background: '#ffffff',
          border: '1px solid #dddddd',
          color: '#555555',
          padding: '2px 0',
          position: 'fixed',
          overflow: 'auto',
          maxHeight: '50%'
        }}
        items={this.props.questions}
        value={this.state.question}
        shouldItemRender={this.matchStateToTerm}
        sortItems={this.sortStates}
        onChange={(event, value) => this.onChange(value)}
        onSelect={value => this.onChange(value, true)}
        getItemValue={(item) => item}
        renderItem={(item, isHighlighted) => (
          <div className="question">{item}</div>
        )}
      />
    );
  }
});
