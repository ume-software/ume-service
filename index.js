const { spawn } = require('child_process');
function generateCode(inputFile, outputDir) {
    const args = [
        'generate',
        '-i',
        inputFile,
        '-g',
        'typescript-express-server',
        '-o',
        outputDir,
        '--skip-validate-spec'
    ];

    const generator = spawn('openapi-generator', args);

    generator.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    generator.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    generator.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

const inputFile = 'swagger/swagger.yaml';
const outputDir = 'swagger/dir';

generateCode(inputFile, outputDir);
