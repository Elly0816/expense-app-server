import type Groq from 'groq-sdk';
import functionNames from './functionNames';

export const getExpensesByCategoryTool: Groq.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: functionNames.getExpenseByCategory,
    description: 'Get expenses by their category',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description:
            'The id of the user which should be the userId of the particular expense in the database',
        },
        category: {
          type: 'string',
          description: 'This is the category of the expense',
        },
      },
      required: ['userId', 'category'],
    },
  },
};
