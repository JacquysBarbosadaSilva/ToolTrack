/**
 * Definições de Tipagem e Estrutura de Entidades
 * Preparadas para futura modelagem de chave/valor no AWS DynamoDB
 *
 * Exemplo de formato NoSQL planejado:
 * PK: USER#<id>
 * SK: METADATA#<id>
 */

/**
 * @typedef {Object} User
 * @property {string} id - Chave primária / Partition Key (PK)
 * @property {string} name - Nome completo do usuário
 * @property {string} email - Endereço de e-mail do usuário
 * @property {string} role - Papel/função do usuário
 * @property {string} createdAt - Data ISO de criação
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} name - Nome de usuário
 * @property {string} email - E-mail do usuário
 * @property {string} password - Senha
 */
