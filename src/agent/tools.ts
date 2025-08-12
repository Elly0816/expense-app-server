import type Groq from 'groq-sdk';
import functionNames from './functionNames';

const userIdProp = {
  type: 'string',
  description:
    'The id of the user which should be the userId of the particular expense in the database',
};

const startDateProp = {
  type: 'string',
  format: 'date-time',
  description: `When getting expenses by date, this is the start date in ISO 8601 format (e.g., 2025-08-11T14:30:00Z) to filter by. The expenses should not be earlier than this date. 
    
    `,
};

const endDateProp = {
  type: 'string',
  format: 'date-time',
  description: `When getting expenses by date, this is the end date in ISO 8601 format (e.g., 2025-08-11T14:30:00Z) to filter by. The expenses should not be later than this date.`,
};

const categoryProp = {
  type: 'string',
  description: 'This is the category of the expense',
};

export const getExpensesByCategoryTool: Groq.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: functionNames.getExpenseByCategory,
    description: 'Get expenses by their category',
    parameters: {
      type: 'object',
      properties: {
        userId: userIdProp,
        category: categoryProp,
      },
      required: ['userId', 'category'],
    },
  },
};

export const getExpenseByDateTool: Groq.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: functionNames.getExpenseByDate,
    description: `Get expenses by their date. Use this function when the user asks for expenses with regard to time, use the appropriate date values if they're not mentioned
      Use this tool ONLY when you are asked any date related queries.
      `,
    parameters: {
      type: 'object',
      properties: {
        userId: userIdProp,
        startDate: startDateProp,
        endDate: endDateProp,
        category: categoryProp,
      },
      required: ['userId', 'category', 'startDate', 'endDate'],
    },
  },
};
