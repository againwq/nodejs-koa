import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
export default{
    FILE_DEPOSIT_PATH: `${__dirname}/static/FilesDeposit`
}