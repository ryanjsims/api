module "api_staging" {
  source             = "./modules/api"
  namespace          = "ps2alerts"
  environment        = "staging"
  identifier         = "ps2alerts-api-staging"
  checksum_version   = var.checksum_version
  database_user      = var.db_user
  database_pass      = var.db_pass
  database_host      = "ps2alerts-db"
  database_port      = 27017
  database_name      = "ps2alerts-staging"
  database_pool_size = 100
  database_debug     = false
  rabbitmq_host      = "ps2alerts-rabbitmq"
  rabbitmq_user      = "ps2alerts"
  rabbitmq_pass      = var.rabbitmq_pass
  rabbitmq_vhost     = "/ps2alerts"
  rabbitmq_queue     = "api-queue-staging"
  rabbitmq_prefetch  = 750
  cpu_limit          = "250m"
  mem_limit          = "0.25Gi"
  cpu_request        = "150m"
  mem_request        = "0.25Gi"
  logger_transports  = "console"
  dd_api_key         = var.dd_api_key
  dd_app_key         = var.dd_app_key
  multi_urls         = false
  urls               = ["staging.api.ps2alerts.com"]
}