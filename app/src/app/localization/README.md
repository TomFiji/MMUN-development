# Translation  System 

<br>


## Dictionary files
these files are include a json of key values.
Each language has it own file. The name for each file should follow `<language>.lang.ts`.

After adding a language, you need to import it in the service as well, and add it to array of support languages 

string tokens should be dotted camel case. For example a token for a card component header's title would be
> 'components.card.header.title' : 'Card Title'

<br>

### Dynamic Variables 
the language token can accept variables to replace placeholders.
The placeholders should follow the pattern `{{<name>}}`.
The name is the key that would be passed as a variable

for example, the token for text "Hello John, your project 'Save the Seas' got up-voted" would be
> 'profile.notification.project.up-vote' : 'Hello {{name}}, your project {{project}} got up-voted'

<br>

## Usage of Service (For TypeScript)
in order to use the translation service in typescript files follow these instructions:
First inject (import) the service into the class by adding it to the constructor.

> `constructor(private localizationService: LocalizationService){}`

Now you can use the `translate` method to translate any tokens.
> `this.localizationService.translate('components.card.header.title');`

> output: `Card Title`

<br>

### With Dynamic Variables
you need to pass a key-value objects for each param. You can also spread an array

> `this.localizationService.translate('profile.notification.project.up-vote', {key: 'name', value: 'John'}, {key: 'project', value: '"Save the seas"'});`

> output: `Hello John, your project 'Save the Seas' got up-voted`

<br>

## Usage of Pipe (For HTML)
in order to use the translation pipe in html files follow these instructions:
First you need to import the pipe in the page/component module

> `declarations: [LocalizePipe]`

you can use the `localize` pipe to translate any tokens.
> `<div>{{ 'components.card.header.title' | localize }}</div>`

> output: `<div>Card Title</div>`

<br>

### With Dynamic Variables
you need to pass a key-value objects for each param. You can also spread an array

> `<div>{{ 'profile.notification.project.up-vote' | localize:{key: 'name', value: 'John'}:{key: 'project', value: '"Save the seas"'} }}</div>`

> output: `<div>Hello John, your project 'Save the Seas' got up-voted</div>`

<br>

## Changing System Language

In order to change the system language you first need to inject the service:

> `constructor(private localizationService: LocalizationService){}`

then you need to call the `setLanguage` method and pass the language name token.

> `this.localizationService.setLanguage('en');`
