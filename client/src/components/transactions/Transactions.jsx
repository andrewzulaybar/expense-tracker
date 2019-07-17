import { Button, Col, Table, Tag, Typography } from 'antd';
import { green, red } from '@ant-design/colors';
import React, { Component } from 'react';

import './Transactions.css'
import { TransactionsContext } from './TransactionsProvider';

const schema = [
  'Amount',
  'Description',
  'Method',
  'Tags',
  'Date'
];

const tagColors = {
  'clothes': 'blue',
  'income': 'green',
  'restaurants': 'red',
  'skincare': 'yellow',
  'travel': 'orange',
};

const columns = initializeColumns();
function initializeColumns() {
  let columns = [];
  for (let i = 0; i < schema.length; i++) {
    const item = {
      title: schema[i],
      dataIndex: schema[i].toLowerCase(),
      key: schema[i].toLowerCase(),
    };
    columns.push(item);
  }

  // format amount
  let amountIndex = schema.indexOf('Amount');
  columns[amountIndex].render = amount => {
    if (amount < 0) {
      return (
        <div style={{color: red[4]}}>
          - ${-amount}
        </div>
      );
    } else {
      return (
        <div style={{color: green[3]}}>
          + ${amount}
        </div>
      );
    }
  };

  // format tags
  let tagsIndex = schema.indexOf('Tags');
  columns[tagsIndex].render = tags => (
    <span>
      {(tags)
        ? tags.map(tag => {
          let color = tagColors[tag];
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })
        : []}
    </span>
  );

  return columns;
}

const WithContext = (Component) => {
  return (props) => (
    <TransactionsContext.Consumer>
      {(context) =>
        <Component {...props} context={context} />
      }
    </TransactionsContext.Consumer>
  )
};

class Transactions extends Component {
  state = {
    showButton: false,
    selected: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { handleDelete } = this.props.context;
    handleDelete(this.state.selected);
  };

  render() {
    const { transactionSpan } = this.props;
    const { transactions } = this.props.context;

    const rowSelection = {
      onChange: (selected) => {
        this.setState({ selected: selected });

        if (selected.length === 0) {
          this.setState({ showButton: false })
        } else {
          this.setState({ showButton: true });
        }
      },
    };

    return (
      <Col className="transactions-list" {...transactionSpan}>
        <Typography.Title level={2}>
          Transactions
        </Typography.Title>
        <Table
          className="transactions"
          columns={columns}
          dataSource={transactions}
          pagination={false}
          rowKey={(record) => { return record._id }}
          rowSelection={rowSelection}
          size="middle"
          footer={
            (this.state.showButton)
              ? () => {
                return (
                  <Button onClick={this.handleSubmit}  type="primary">
                    Delete
                  </Button>
                )
              }
              : undefined
          }
        />
      </Col>
    );
  }
}

export default WithContext(Transactions);