<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Tenant\Statement;
use App\Models\Tenant\StatementTemplate;
use App\Models\Tenant\Tag;
use App\Services\TagService;
use App\Services\TemplateParserService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class StatementController extends Controller
{
    //

    public function index(Request $request): Response
    {
        $templates = Statement::all();

        return response($templates);
    }

    public function store(Request $request): Response
    {
        $data = $request->all();

        $template = StatementTemplate::find($data['template_id']);
        $parser = new TemplateParserService($template->content, $data['from'], $data['to']);
        $report = Statement::create([
            'title' => $template->title,
            'content' => $parser->parse(),
            'template_id' => $template->id,
            'from' => $data['from'],
            'to' => $data['to']
        ]);

        return response($report);
    }

    public function show(Request $request, int $statement): Response
    {
        $statement = Statement::find($statement);

        return response($statement);
    }

    public function update(Request $request, int $statement): Response
    {
        $statement = Statement::find($statement);
        $statement->update($request->all());

        return response($statement);
    }

    public function test(Request $request): Response
    {
        $statement = Statement::find($request->query('id'));
        $service = new TemplateParserService($statement->content, $statement->from, $statement->to);

        return response($service->toJson());
    }

    private function templateParser(string $template, $from, $to): string
    {
        $service = new TagService();

        $newtemplate = preg_match_all('/\{\{(\w+)\}\}/', $template, $matches);
        $fields = array_combine($matches[0], $matches[1]);
        $fieldsProcessed = [];
        foreach ($fields as $key => $value) {
            $tag = Tag::where('label', $value)->first();
            $tagBalance = $service->getTagMembersBalanceByRange($tag->id, $from, $to);
            $fieldsProcessed[$key] = $tagBalance;
        }

        $templateProcessed = str_replace(array_keys($fieldsProcessed), array_values($fieldsProcessed), $template);

        Log::info($matches, [__LINE__, __FILE__]);
        Log::info($fields, [__LINE__, __FILE__]);
        Log::info($fieldsProcessed, [__LINE__, __FILE__]);
        Log::info($templateProcessed, [__LINE__, __FILE__]);
        return $templateProcessed;
    }
}
