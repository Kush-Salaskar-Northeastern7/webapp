module.exports = {
    apps: [
        {
            name: 'webapp',
            script: 'npm',
            args: 'start',
            env: {
                "NODE_ENV": "production",
            },
            error_file: '/home/ec2-user/logs/app_error.log',
            combine_logs: true,
            out_file: '/home/ec2-user/logs/app_output.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z'
        },
    ],
}