pipeline {
  agent any

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps chromium'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
          archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
      }
    }

    stage('Deploy Report Demo') {
      when {
        branch 'main'
      }
      steps {
        sh 'echo "Simulate publish HTML report"'
        sh 'test -d playwright-report && ls -la playwright-report || true'
      }
    }
  }
}
