import gulp from 'gulp'
import shell from './index'

const files = ['*.ts']

gulp.task(
  'build',
  shell.task('tsc'),
)

gulp.task(
  'test',
  shell.task('mocha'),
)
gulp.task(
  'coverage',
  shell.task('nyc mocha'),
)
gulp.task(
  'coveralls',
  gulp.series(
    'test',
    shell.task('nyc report --reporter=text-lcov'),
  ),
)

gulp.task(
  'lint',
  shell.task('eslint --fix' + files.join(' ')),
)

gulp.task(
  'format',
  shell.task('prettier --write ' + files.join(' ')),
)

gulp.task(
  'default',
  gulp.series(
    'build',
    'test',
    'coverage',
    'lint',
    'format',
  ),
)

gulp.task(
  'watch',
  gulp.series(
    'default',
    () => {
      gulp.watch(
        files,
        gulp.task('default'),
      )
    },
  ),
)
