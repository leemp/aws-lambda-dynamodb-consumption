# aws-lambda-dynamodb-consumption

Helps to reduce dynamodb expenses;

Uses Claudia.js;

Usage:

`https://api.eu-west-1.amazonaws.com/latest/{table}/{value}[?index={index_name}]`

{Table} - table name

{value} - integer value for ReadCapacityUnits

optional GET parameter index name {index_name}

### Note

Real consumption would get automatically reduced to 1 in about 30-50 mins by another Lambda function.

Use <https://github.com/leemp/aws-lambda-dynamodb-helper>
