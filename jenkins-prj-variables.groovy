def get_variables_for_env(current_env){
    def prj_name = 'bee-playground-backend'
    def ecs_cluster = "bee-ecs-cluster"
    def number_of_cpu = null
    def memory_available = null
    def profile = null
    def registry_account = "336735913602.dkr.ecr.eu-west-1.amazonaws.com"
    def region_conf = null
    def service_name = "pro-bee-playground-backend-service"
    

if ( current_env == "pro" ) {
        profile = "mailupinc_super_provisioning"

        region_conf = [
            region_1: [
                region_name: "eu-west-1",
                skip_update_service: false,
                ecs_cluster: "bee-ecs-cluster",
                service_name: "pro-bee-playground-backend-service",
                task_definition_family: "pro-bee-playground-backend",
                number_of_cpu: 2048,
                memory_available: 4096,
            ],
        ]

    } else {
        error("Invalid env (${current_env})")
}

    return [
        region_conf: region_conf,
        git_credentials_id: 'fa4c24f7-a7db-4d1e-9896-1517a81f386f',
        current_env: current_env,
        registry_account: registry_account,
        dockerfile_path: 'docker/Dockerfile.backend',
        s3_env_secrets: true,
        prj_name: prj_name,
        run_tests: false,
        download_db_seed_for_tests: false,
        region: 'eu-west-1',
        profile: profile,
        number_of_cpu: number_of_cpu,
        memory_available: memory_available,
        container_port: 3001,
        task_definition_family: "${current_env}-${prj_name}",
        task_role_arn: 'ecsTaskRole',
        ecs_cluster: ecs_cluster,
        service_name: service_name,
        slack_enabled: false,
        skip_update_service: false,
        slack_prj_emoji: ':portalblueparrot:',
    ]

}

// DONT MISS THIS LINE. return this is the key for loading script from jenkins-unified-ci.groovy
return this
