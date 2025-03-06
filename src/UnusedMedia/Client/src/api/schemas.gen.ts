// This file is auto-generated by @hey-api/openapi-ts

export const EventMessageTypeModelSchema = {
    enum: ['Default', 'Info', 'Error', 'Success', 'Warning'],
    type: 'string'
} as const;

export const MediaViewModelSchema = {
    required: ['icon', 'key', 'name'],
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        key: {
            type: 'string',
            format: 'uuid'
        },
        icon: {
            type: 'string'
        }
    },
    additionalProperties: false
} as const;

export const NotificationHeaderModelSchema = {
    required: ['category', 'message', 'type'],
    type: 'object',
    properties: {
        message: {
            type: 'string'
        },
        category: {
            type: 'string'
        },
        type: {
            '$ref': '#/components/schemas/EventMessageTypeModel'
        }
    },
    additionalProperties: false
} as const;