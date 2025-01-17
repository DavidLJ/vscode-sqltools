import { EXT_NAME } from '@sqltools/core/constants';
import { ExtensionContext, TreeItemCollapsibleState, SnippetString } from 'vscode';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
import SidebarAbstractItem from './SidebarAbstractItem';
export default class SidebarFunction extends SidebarAbstractItem<null> {
  public contextValue = 'connection.function';
  public value: string;
  public get items(): null { return null; }
  public addItem(_: never): never {
    throw new Error('Cannot add items to database function');
  }
  public get conn() { return this.parent.conn; }
  constructor(context: ExtensionContext, public functionData: DatabaseInterface.Function) {
    super(functionData.name, TreeItemCollapsibleState.None);
    this.value = functionData.name;
    this.iconPath = {
      dark: context.asAbsolutePath('icons/function-dark.svg'),
      light: context.asAbsolutePath('icons/function-light.svg'),
    };
    this.description = `${this.functionData.name}(${this.functionData.args.join(',')}) => ${this.functionData.resultType || 'void'}`;
    this.tooltip = `${this.functionData.signature}(${this.functionData.args.join(',')}) => ${this.functionData.resultType || 'void'}`;
    this.value = `${this.functionData.signature}`;
    let args = [];
    this.functionData.args.forEach((type, index) => {
      const [argName, argType] = type.split('=>');
      if (argType && argType.trim()) {
        args.push(`${argName} => \${${index + 1}:${argType}}`);
      }
      else {
        args.push(`\${${index + 1}:${type}}`);
      }
    });
    this.snippet = new SnippetString(`${this.functionData.signature}(${args.join(', ')})$0`);
    this.command = {
      title: 'Append to Cursor',
      command: `${EXT_NAME}.insertText`,
      arguments: [this.snippet],
    };
  }
}
