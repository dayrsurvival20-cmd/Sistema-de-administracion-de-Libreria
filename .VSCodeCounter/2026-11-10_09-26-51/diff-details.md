# Diff Details

Date : 2026-11-10 09:26:51

Directory c:\\LMSReact\\backend

Total : 55 files,  -5542 codes, 43 comments, -143 blanks, all -5642 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [backend/backend/\_\_init\_\_.py](/backend/backend/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/backend/asgi.py](/backend/backend/asgi.py) | Python | 4 | 8 | 5 | 17 |
| [backend/backend/settings.py](/backend/backend/settings.py) | Python | 88 | 25 | 36 | 149 |
| [backend/backend/urls.py](/backend/backend/urls.py) | Python | 9 | 0 | 3 | 12 |
| [backend/backend/wsgi.py](/backend/backend/wsgi.py) | Python | 4 | 8 | 5 | 17 |
| [backend/db.sqlite3](/backend/db.sqlite3) | Database | 130 | 0 | 0 | 130 |
| [backend/libraryapp/\_\_init\_\_.py](/backend/libraryapp/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/libraryapp/admin.py](/backend/libraryapp/admin.py) | Python | 7 | 1 | 3 | 11 |
| [backend/libraryapp/apps.py](/backend/libraryapp/apps.py) | Python | 3 | 0 | 3 | 6 |
| [backend/libraryapp/migrations/0001\_initial.py](/backend/libraryapp/migrations/0001_initial.py) | Python | 87 | 1 | 7 | 95 |
| [backend/libraryapp/migrations/0002\_alter\_issuedbook\_book.py](/backend/libraryapp/migrations/0002_alter_issuedbook_book.py) | Python | 13 | 1 | 6 | 20 |
| [backend/libraryapp/migrations/\_\_init\_\_.py](/backend/libraryapp/migrations/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/libraryapp/models.py](/backend/libraryapp/models.py) | Python | 45 | 3 | 12 | 60 |
| [backend/libraryapp/serializers.py](/backend/libraryapp/serializers.py) | Python | 41 | 0 | 10 | 51 |
| [backend/libraryapp/tests.py](/backend/libraryapp/tests.py) | Python | 1 | 1 | 2 | 4 |
| [backend/libraryapp/urls.py](/backend/libraryapp/urls.py) | Python | 49 | 0 | 17 | 66 |
| [backend/libraryapp/views.py](/backend/libraryapp/views.py) | Python | 697 | 9 | 132 | 838 |
| [backend/manage.py](/backend/manage.py) | Python | 15 | 3 | 5 | 23 |
| [backend/requirements.txt](/backend/requirements.txt) | pip requirements | 19 | 0 | 0 | 19 |
| [frontend/README.md](/frontend/README.md) | Markdown | -9 | 0 | -8 | -17 |
| [frontend/eslint.config.js](/frontend/eslint.config.js) | JavaScript | -20 | 0 | -2 | -22 |
| [frontend/index.html](/frontend/index.html) | HTML | -23 | -1 | -2 | -26 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | -2,751 | 0 | -1 | -2,752 |
| [frontend/package.json](/frontend/package.json) | JSON | -30 | 0 | -1 | -31 |
| [frontend/public/favicon.svg](/frontend/public/favicon.svg) | XML | -1 | 0 | 0 | -1 |
| [frontend/public/icons.svg](/frontend/public/icons.svg) | XML | -24 | 0 | -1 | -25 |
| [frontend/src/App.css](/frontend/src/App.css) | PostCSS | -158 | 0 | -27 | -185 |
| [frontend/src/App.jsx](/frontend/src/App.jsx) | JavaScript JSX | -58 | 0 | -4 | -62 |
| [frontend/src/Components/Header.jsx](/frontend/src/Components/Header.jsx) | JavaScript JSX | -211 | 0 | -28 | -239 |
| [frontend/src/Pages/AddAuthors.jsx](/frontend/src/Pages/AddAuthors.jsx) | JavaScript JSX | -133 | 0 | -11 | -144 |
| [frontend/src/Pages/AddBook.jsx](/frontend/src/Pages/AddBook.jsx) | JavaScript JSX | -193 | 0 | -25 | -218 |
| [frontend/src/Pages/AddCategory.jsx](/frontend/src/Pages/AddCategory.jsx) | JavaScript JSX | -156 | 0 | -15 | -171 |
| [frontend/src/Pages/AdminChangePassword.jsx](/frontend/src/Pages/AdminChangePassword.jsx) | JavaScript JSX | -138 | 0 | -14 | -152 |
| [frontend/src/Pages/AdminDashboard.jsx](/frontend/src/Pages/AdminDashboard.jsx) | JavaScript JSX | -213 | 0 | -10 | -223 |
| [frontend/src/Pages/AdminLogin.jsx](/frontend/src/Pages/AdminLogin.jsx) | JavaScript JSX | -96 | 0 | -9 | -105 |
| [frontend/src/Pages/IssuedBook.jsx](/frontend/src/Pages/IssuedBook.jsx) | JavaScript JSX | -236 | -3 | -16 | -255 |
| [frontend/src/Pages/IssuedBookDetails.jsx](/frontend/src/Pages/IssuedBookDetails.jsx) | JavaScript JSX | -179 | -2 | -15 | -196 |
| [frontend/src/Pages/ManageAuthors.jsx](/frontend/src/Pages/ManageAuthors.jsx) | JavaScript JSX | -196 | 0 | -15 | -211 |
| [frontend/src/Pages/ManageBooks.jsx](/frontend/src/Pages/ManageBooks.jsx) | JavaScript JSX | -325 | 0 | -26 | -351 |
| [frontend/src/Pages/ManageCategories.jsx](/frontend/src/Pages/ManageCategories.jsx) | JavaScript JSX | -219 | 0 | -16 | -235 |
| [frontend/src/Pages/ManageIssuedBooks.jsx](/frontend/src/Pages/ManageIssuedBooks.jsx) | JavaScript JSX | -114 | 0 | -9 | -123 |
| [frontend/src/Pages/ManageStudents.jsx](/frontend/src/Pages/ManageStudents.jsx) | JavaScript JSX | -139 | 0 | -12 | -151 |
| [frontend/src/Pages/StudentBooks.jsx](/frontend/src/Pages/StudentBooks.jsx) | JavaScript JSX | -136 | -1 | -17 | -154 |
| [frontend/src/Pages/StudentChangePassword.jsx](/frontend/src/Pages/StudentChangePassword.jsx) | JavaScript JSX | -109 | -1 | -16 | -126 |
| [frontend/src/Pages/StudentDashboard.jsx](/frontend/src/Pages/StudentDashboard.jsx) | JavaScript JSX | -137 | 0 | -11 | -148 |
| [frontend/src/Pages/StudentHistory.jsx](/frontend/src/Pages/StudentHistory.jsx) | JavaScript JSX | -114 | 0 | -10 | -124 |
| [frontend/src/Pages/StudentIssuedBooks.jsx](/frontend/src/Pages/StudentIssuedBooks.jsx) | JavaScript JSX | -163 | 0 | -14 | -177 |
| [frontend/src/Pages/StudentProfile.jsx](/frontend/src/Pages/StudentProfile.jsx) | JavaScript JSX | -137 | -1 | -13 | -151 |
| [frontend/src/Pages/UserLogin.jsx](/frontend/src/Pages/UserLogin.jsx) | JavaScript JSX | -96 | 0 | -11 | -107 |
| [frontend/src/Pages/UserSignUp.jsx](/frontend/src/Pages/UserSignUp.jsx) | JavaScript JSX | -122 | -7 | -16 | -145 |
| [frontend/src/assets/react.svg](/frontend/src/assets/react.svg) | XML | -1 | 0 | 0 | -1 |
| [frontend/src/assets/vite.svg](/frontend/src/assets/vite.svg) | XML | -1 | 0 | -1 | -2 |
| [frontend/src/index.css](/frontend/src/index.css) | PostCSS | -100 | 0 | -12 | -112 |
| [frontend/src/main.jsx](/frontend/src/main.jsx) | JavaScript JSX | -11 | 0 | -2 | -13 |
| [frontend/vite.config.js](/frontend/vite.config.js) | JavaScript | -5 | -1 | -2 | -8 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details